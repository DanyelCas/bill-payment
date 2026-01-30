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
    createReceipt(invoices: Invoice[], userId: string, paymentMethod: string = 'QR / Transferencia'): Observable<Receipt> {
        const timestamp = new Date();
        const receipt: Receipt = {
            id: this.generateReceiptId(timestamp),
            timestamp: timestamp.toISOString(),
            userId: userId,
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

        // --- Header ---
        doc.setFillColor(this.colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(this.colors.white);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPROBANTE DE PAGO', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Pago de Servicios', pageWidth - 20, 20, { align: 'right' });

        // --- Receipt Details ---
        const startY = 55;

        doc.setTextColor(this.colors.textDark);
        doc.setFontSize(10);

        // Left Column
        doc.setFont('helvetica', 'bold');
        doc.text('Nº Recibo:', 20, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(receipt.id, 45, startY);

        doc.setFont('helvetica', 'bold');
        doc.text('Fecha:', 20, startY + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(receipt.timestamp).toLocaleString(), 45, startY + 8);

        // Right Column
        doc.setFont('helvetica', 'bold');
        doc.text('ID Usuario:', pageWidth - 80, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(receipt.userId, pageWidth - 20, startY, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Método:', pageWidth - 80, startY + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(receipt.paymentMethod, pageWidth - 20, startY + 8, { align: 'right' });

        // --- Table ---
        const tableHeaders = [['Servicio', 'Período', 'Monto (Bs.)']];
        const tableData = receipt.items.map(item => [
            item.servicio,
            item.periodo,
            this.formatCurrency(item.monto)
        ]);

        autoTable(doc, {
            startY: startY + 20,
            head: tableHeaders,
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: this.colors.primary,
                textColor: this.colors.white,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 10,
                cellPadding: 5,
                textColor: this.colors.gray700,
                lineColor: this.colors.gray200,
            },
            alternateRowStyles: {
                fillColor: this.colors.gray100
            }
        });

        // --- Total ---
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(this.colors.primary);
        doc.text('Total Pagado:', pageWidth - 90, finalY);
        doc.text(this.formatCurrency(receipt.totalAmount), pageWidth - 20, finalY + 1, { align: 'right' });

        // --- Footer ---
        const footerY = doc.internal.pageSize.height - 20;
        doc.setFontSize(8);
        doc.setTextColor(this.colors.secondary);
        doc.text('Gracias por su pago.', 20, footerY);
        doc.text('Este documento es un comprobante de transacción generado electrónicamente.', 20, footerY + 5);

        // Save
        doc.save(`Recibo-${receipt.id}.pdf`);
    }

    private generateReceiptId(date: Date): string {
        const timestamp = date.getTime().toString().slice(-6); // Last 6 digits of timestamp
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REC-${timestamp}-${random}`;
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }
}
