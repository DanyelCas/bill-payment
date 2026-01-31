import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Receipt } from '../models/receipt.model';
import { Invoice } from '../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class ReceiptService {
    private apiUrl = 'http://localhost:3000/receipts'; // Hardcoded for now based on db.json location

    // Design System Colors
    private colors = {
        primary: '#1E3A8A',    // Deep Blue
        secondary: '#64748B',  // Slate
        gray100: '#F1F5F9',
        gray200: '#E2E8F0',
        gray700: '#334155',
        white: '#FFFFFF',
        textDark: '#0F172A'
    };

    constructor(private http: HttpClient) { }

    /**
     * Creates a receipt record and saves it to the backend
     */
    createReceipt(invoices: Invoice[], userId: string, customerName: string, paymentMethod: string = 'QR / Transferencia'): Observable<Receipt> {
        const timestamp = new Date();
        const receipt: Receipt = {
            id: this.generateReceiptId(timestamp),
            timestamp: timestamp.toISOString(),
            userId: userId,
            customerName: customerName,
            items: invoices.map(inv => ({
                invoiceId: inv.id,
                servicio: inv.servicio,
                periodo: inv.periodo,
                monto: inv.monto
            })),
            totalAmount: invoices.reduce((sum, inv) => sum + inv.monto, 0),
            paymentMethod: paymentMethod
        };

        return this.http.post<Receipt>(this.apiUrl, receipt).pipe(
            tap(savedReceipt => console.log('Receipt saved:', savedReceipt))
        );
    }

    /**
     * Generates and downloads a PDF for the given receipt
     */
    generatePDF(receipt: Receipt): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // --- Header Background ---
        doc.setFillColor(this.colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // --- Header Text ---
        doc.setTextColor(this.colors.white);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPROBANTE DE PAGO', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Pagos', pageWidth - 20, 20, { align: 'right' });
        doc.text(new Date().toLocaleDateString(), pageWidth - 20, 25, { align: 'right' });

        // --- Client & Receipt Info ---
        const startY = 55;

        // Setup Grid
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);

        // Info Box Background
        doc.setFillColor(248, 250, 252); // Very light gray
        doc.roundedRect(15, startY - 5, pageWidth - 30, 40, 3, 3, 'F');
        doc.rect(15, startY - 5, pageWidth - 30, 40, 'S'); // Border

        doc.setTextColor(this.colors.textDark);
        doc.setFontSize(10);

        // Column 1: Client Info
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS DEL CLIENTE', 25, startY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Razón Social / Nombre:', 25, startY + 15);
        doc.setFont('helvetica', 'bold');
        doc.text(receipt.customerName || 'N/A', 65, startY + 15);

        doc.setFont('helvetica', 'normal');
        doc.text('Código de Cliente:', 25, startY + 22);
        doc.setFont('helvetica', 'bold');
        doc.text(receipt.userId, 65, startY + 22);

        // Column 2: Transaction Info
        const col2X = pageWidth / 2 + 10;
        doc.setFontSize(10);
        doc.text('DETALLES DE TRANSACCIÓN', col2X, startY + 5);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Nº Comprobante:', col2X, startY + 15);
        doc.setFont('helvetica', 'bold');
        doc.text(receipt.id, col2X + 35, startY + 15);

        doc.setFont('helvetica', 'normal');
        doc.text('Fecha y Hora:', col2X, startY + 22);
        doc.setFont('helvetica', 'bold');
        doc.text(new Date(receipt.timestamp).toLocaleString(), col2X + 35, startY + 22);

        doc.setFont('helvetica', 'normal');
        doc.text('Método de Pago:', col2X, startY + 29);
        doc.setFont('helvetica', 'bold');
        doc.text(receipt.paymentMethod, col2X + 35, startY + 29);


        // --- Table ---
        const tableHeaders = [['Servicio', 'Período', 'Monto (Bs.)']];
        const tableData = receipt.items.map(item => [
            item.servicio,
            item.periodo,
            this.formatCurrency(item.monto)
        ]);

        autoTable(doc, {
            startY: startY + 45,
            head: tableHeaders,
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: this.colors.primary,
                textColor: this.colors.white,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                halign: 'center'
            },
            styles: {
                fontSize: 9,
                cellPadding: 6,
                textColor: this.colors.gray700,
                lineColor: this.colors.gray200,
            },
            alternateRowStyles: {
                fillColor: this.colors.gray100
            },
            margin: { left: 15, right: 15 }
        });

        // --- Total ---
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 5;

        // Total Box
        doc.setFillColor(this.colors.primary);
        doc.rect(pageWidth - 75, finalY, 60, 12, 'F');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(this.colors.white);
        doc.text('TOTAL:', pageWidth - 70, finalY + 8);
        doc.text(this.formatCurrency(receipt.totalAmount), pageWidth - 20, finalY + 8, { align: 'right' });

        // --- Footer ---
        const footerY = pageHeight - 25;
        doc.setDrawColor(this.colors.gray200);
        doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

        doc.setFontSize(8);
        doc.setTextColor(this.colors.secondary);
        doc.setFont('helvetica', 'normal');
        doc.text('Gracias por su pago.', pageWidth / 2, footerY, { align: 'center' });
        doc.text('Este documento es un comprobante electrónico válido.', pageWidth / 2, footerY + 5, { align: 'center' });

        // Save
        doc.save(`Comprobante-${receipt.id}.pdf`);
    }

    private generateReceiptId(date: Date): string {
        const timestamp = date.getTime().toString().slice(-6); // Last 6 digits of timestamp
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REC-${timestamp}-${random}`;
    }

    /**
     * Searches for a receipt by its unique ID
     */
    getReceiptById(id: string): Observable<Receipt[]> {
        // json-server supports filtering like /receipts?id=REC-123 AND expanding relationships
        // effectively doing a JOIN with users using userId
        return this.http.get<any[]>(`${this.apiUrl}?id=${id}&_expand=user`).pipe(
            tap(results => {
                // Map the expanded user to customerName for backward compatibility
                results.forEach((r: any) => {
                    if (!r.customerName && r.user) {
                        r.customerName = r.user.name;
                    }
                });
            })
        );
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }
}
