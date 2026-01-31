import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InvoiceService } from './invoice.service';

export interface ChartData {
    name: string;
    value: number;
}

export interface DashboardStats {
    totalPending: number;
    upcomingDues: Invoice[]; // Mapped to upcomingInvoices in component
    upcomingInvoices: Invoice[]; // Alias for upcomingDues to match template expectations
    monthlySavings: number;
    averageSpend: number;
    monthlySpendData: { month: string; amount: number }[]; // For Average Spend Widget
    savingsDetails?: {
        currentMonth: string;
        prevMonth: string;
        currentAmount: number;
        prevAmount: number;
    };
    categoryData: ChartData[]; // For Spend Chart
    statusData: ChartData[];   // For Status Chart
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private invoiceService: InvoiceService) { }

    private parsePeriodoFrom(mes: string, anio: number): Date {
        // Format: "Enero", 2024
        const months: { [key: string]: number } = {
            'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
            'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };
        const mesLower = mes.toLowerCase();
        if (months[mesLower] !== undefined) {
            return new Date(anio, months[mesLower], 1);
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

                // Total Pending
                const totalPending = pending.reduce((acc, curr) => acc + curr.monto, 0);

                // Upcoming Dues
                const sortedPending = pending.sort((a, b) =>
                    this.parsePeriodoFrom(a.mes, a.anio).getTime() - this.parsePeriodoFrom(b.mes, b.anio).getTime()
                );
                const upcomingDues = sortedPending;

                // --- Average Spend Calculation ---
                const allByMonth: { [key: string]: number } = {};
                invoices.forEach(inv => {
                    const date = this.parsePeriodoFrom(inv.mes, inv.anio);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    if (!allByMonth[key]) allByMonth[key] = 0;
                    allByMonth[key] += inv.monto;
                });

                const allMonthKeys = Object.keys(allByMonth).sort((a, b) => {
                    const [yA, mA] = a.split('-').map(Number);
                    const [yB, mB] = b.split('-').map(Number);
                    return new Date(yB, mB).getTime() - new Date(yA, mA).getTime();
                });

                const averageSpend = allMonthKeys.length > 0
                    ? allMonthKeys.reduce((acc, key) => acc + allByMonth[key], 0) / allMonthKeys.length
                    : 0;

                const last3Months = allMonthKeys.slice(0, 3).map(key => ({
                    month: this.getKeyName(key),
                    amount: allByMonth[key]
                }));

                // --- Savings Calculation ---
                let monthlySavings = 0;
                let savingsDetails = undefined;

                if (allMonthKeys.length >= 2) {
                    const currentKey = allMonthKeys[0];
                    const prevKey = allMonthKeys[1];
                    const currentAmount = allByMonth[currentKey];
                    const prevAmount = allByMonth[prevKey];
                    monthlySavings = prevAmount - currentAmount;
                    savingsDetails = {
                        currentMonth: this.getKeyName(currentKey),
                        prevMonth: this.getKeyName(prevKey),
                        currentAmount,
                        prevAmount
                    };
                }

                // --- Category Data (Spend by Service) ---
                const groupedByService: { [key: string]: number } = {};
                invoices.forEach(inv => {
                    if (!groupedByService[inv.servicio]) groupedByService[inv.servicio] = 0;
                    groupedByService[inv.servicio] += inv.monto;
                });
                const categoryData = Object.keys(groupedByService).map(key => ({
                    name: key,
                    value: Number.parseFloat(groupedByService[key].toFixed(2))
                }));

                // --- Status Data ---
                let paid = 0;
                let pendingAmt = 0;
                let overdueAmt = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                invoices.forEach(inv => {
                    if (inv.estado === 'pagado') {
                        paid += inv.monto;
                    } else { // 'pendiente' or 'vencida' logic
                        // Check if overdue
                        let isOverdue = false;
                        if (inv.fechaVencimiento) {
                            const dateParts = inv.fechaVencimiento.split('-');
                            if (dateParts.length === 3) {
                                const dueDateObj = new Date(inv.fechaVencimiento + 'T00:00:00');
                                if (dueDateObj < today) isOverdue = true;
                            }
                        }

                        if (isOverdue) overdueAmt += inv.monto;
                        else pendingAmt += inv.monto;
                    }
                });

                const statusData = [
                    { name: 'Pagado', value: paid },
                    { name: 'Pendiente', value: pendingAmt },
                    { name: 'Vencida', value: overdueAmt }
                ].filter(d => d.value > 0);


                return {
                    totalPending,
                    upcomingDues,
                    upcomingInvoices: upcomingDues, // Alias
                    monthlySavings,
                    averageSpend,
                    monthlySpendData: last3Months,
                    savingsDetails,
                    categoryData,
                    statusData
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
                            const dueDate = this.parsePeriodoFrom(inv.mes, inv.anio);
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
                    const monthName = inv.mes;
                    const year = inv.anio.toString();

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
