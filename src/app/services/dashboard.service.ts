import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InvoiceService } from './invoice.service';

export interface DashboardStats {
    totalPending: number;
    upcomingDues: Invoice[];
    monthlySavings: number;
    averageSpend: number;
    monthlySpendData: { month: string; amount: number }[];
    savingsDetails?: {
        currentMonth: string;
        prevMonth: string;
        currentAmount: number;
        prevAmount: number;
    };
}

export interface ChartData {
    name: string;
    value: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private invoiceService: InvoiceService) { }

    private parsePeriodo(periodo: string): Date {
        // Format: "Enero 2024"
        const months: { [key: string]: number } = {
            'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
            'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
        };
        const parts = periodo.split(' ');
        if (parts.length === 2 && months[parts[0]] !== undefined) {
            return new Date(parseInt(parts[1]), months[parts[0]], 1);
        }
        return new Date(); // Fallback
    }

    // Helper to get descriptive month name "Mes YYYY" from key "YYYY-MM"
    private getKeyName(key: string): string {
        const [year, monthIndex] = key.split('-').map(Number);
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${months[monthIndex]} ${year}`;
    }

    getStats(customerId: string): Observable<DashboardStats> {
        return this.invoiceService.getInvoices(customerId).pipe(
            map(invoices => {
                const pending = invoices.filter(i => i.estado === 'pendiente');
                const paid = invoices.filter(i => i.estado === 'pagado');

                // Total Pending
                const totalPending = pending.reduce((acc, curr) => acc + curr.monto, 0);

                // Upcoming Dues: All invoices due in the same month as the next due
                const sortedPending = pending.sort((a, b) =>
                    this.parsePeriodo(a.periodo).getTime() - this.parsePeriodo(b.periodo).getTime()
                );

                // Upcoming Dues: Return ALL pending invoices sorted by date
                // The widget handles proper counting of overdue vs upcoming
                let upcomingDues: Invoice[] = sortedPending;

                // Group ALL Invoices by Month for Average Monthly Spend (not just paid)
                const allByMonth: { [key: string]: number } = {};
                invoices.forEach(inv => {
                    const date = this.parsePeriodo(inv.periodo);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    if (!allByMonth[key]) allByMonth[key] = 0;
                    allByMonth[key] += inv.monto;
                });

                const allMonthKeys = Object.keys(allByMonth).sort((a, b) => {
                    const [yA, mA] = a.split('-').map(Number);
                    const [yB, mB] = b.split('-').map(Number);
                    return new Date(yB, mB).getTime() - new Date(yA, mA).getTime(); // Descending
                });

                const averageSpend = allMonthKeys.length > 0
                    ? allMonthKeys.reduce((acc, key) => acc + allByMonth[key], 0) / allMonthKeys.length
                    : 0;

                // Get last 3 months for detailed view
                const last3Months = allMonthKeys.slice(0, 3).map(key => ({
                    month: this.getKeyName(key),
                    amount: allByMonth[key]
                }));

                // Savings Calculation (Current Month vs Previous Month)
                // Group by YYYY-MM key
                const byMonth: { [key: string]: number } = {};
                invoices.forEach(inv => {
                    const date = this.parsePeriodo(inv.periodo);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    if (!byMonth[key]) byMonth[key] = 0;
                    byMonth[key] += inv.monto;
                });

                // Get latest 2 months
                const sortedKeys = Object.keys(byMonth).sort((a, b) => {
                    const [yA, mA] = a.split('-').map(Number);
                    const [yB, mB] = b.split('-').map(Number);
                    return new Date(yB, mB).getTime() - new Date(yA, mA).getTime(); // Descending
                });

                let monthlySavings = 0;
                let savingsDetails = undefined;

                if (sortedKeys.length >= 2) {
                    const currentKey = sortedKeys[0];
                    const prevKey = sortedKeys[1];

                    const currentAmount = byMonth[currentKey];
                    const prevAmount = byMonth[prevKey];

                    monthlySavings = prevAmount - currentAmount;

                    savingsDetails = {
                        currentMonth: this.getKeyName(currentKey),
                        prevMonth: this.getKeyName(prevKey),
                        currentAmount,
                        prevAmount
                    };
                }

                return {
                    totalPending,
                    upcomingDues,
                    monthlySavings, // If positive, you saved money. If negative, you spent more.
                    averageSpend,
                    monthlySpendData: last3Months,
                    savingsDetails
                };
            })
        );
    }

    getSpendByService(customerId: string): Observable<ChartData[]> {
        return this.invoiceService.getInvoices(customerId).pipe(
            map(invoices => {
                const grouped: { [key: string]: number } = {};

                invoices.forEach(inv => {
                    if (!grouped[inv.servicio]) grouped[inv.servicio] = 0;
                    grouped[inv.servicio] += inv.monto;
                });

                return Object.keys(grouped).map(key => ({
                    name: key,
                    value: Number.parseFloat(grouped[key].toFixed(2))
                }));
            })
        );
    }

    getInvoiceStatusDistribution(customerId: string): Observable<ChartData[]> {
        return this.invoiceService.getInvoices(customerId).pipe(
            map(invoices => {
                let paid = 0;
                let pending = 0;
                let overdue = 0;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                invoices.forEach(inv => {
                    if (inv.estado === 'pagado') {
                        paid += inv.monto;
                    } else {
                        // Check if overdue
                        let isOverdue = false;
                        if (inv.fechaVencimiento) {
                            const dueDate = this.parsePeriodo(inv.fechaVencimiento.includes('-') ? inv.periodo : inv.periodo); // Fallback if needed, but logic below uses date string
                            // Actually, let's use the same logic as in table component for consistency
                            const dateParts = inv.fechaVencimiento.split('-');
                            if (dateParts.length === 3) {
                                const dueDateObj = new Date(inv.fechaVencimiento + 'T00:00:00');
                                if (dueDateObj < today) {
                                    isOverdue = true;
                                }
                            }
                        }

                        if (isOverdue) {
                            overdue += inv.monto;
                        } else {
                            pending += inv.monto;
                        }
                    }
                });

                return [
                    { name: 'Pagado', value: paid },
                    { name: 'Pendiente', value: pending },
                    { name: 'Vencida', value: overdue }
                ].filter(d => d.value > 0); // Only show segments with value
            })
        );
    }

    getTrendData(customerId: string): Observable<any[]> {
        return this.invoiceService.getInvoices(customerId).pipe(
            map(invoices => {
                // Group by Year -> Month
                const byYearAndMonth: { [year: string]: { [month: string]: number } } = {};

                invoices.forEach(inv => {
                    const parts = inv.periodo.split(' ');
                    const monthName = parts[0];
                    const year = parts[1];

                    if (!byYearAndMonth[year]) byYearAndMonth[year] = {};
                    if (!byYearAndMonth[year][monthName]) byYearAndMonth[year][monthName] = 0;

                    byYearAndMonth[year][monthName] += inv.monto;
                });

                // Transform to ngx-charts format
                return Object.keys(byYearAndMonth).map(year => ({
                    name: year,
                    series: Object.keys(byYearAndMonth[year]).map(month => ({
                        name: month,
                        value: Number.parseFloat(byYearAndMonth[year][month].toFixed(2))
                    }))
                }));
            })
        );
    }
}
