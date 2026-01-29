import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss'],
})
export class InvoicePaymentComponent {
  @Input() invoices: Invoice[] = [];
  @Input() isOpen = false;
  @Input() isProcessing = false;
  @Input() paymentSuccess = false;
  @Input() paymentError: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() confirmPayment = new EventEmitter<Invoice[]>();

  get singleInvoice(): Invoice | null {
    return this.invoices.length === 1 ? this.invoices[0] : null;
  }

  get totalAmount(): number {
    return this.invoices.reduce((sum, inv) => sum + inv.monto, 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  getEstadoClass(estado: string): string {
    const estadoMap: Record<string, string> = {
      pendiente: 'estado-pendiente',
      pagado: 'estado-pagado',
    };
    return estadoMap[estado] || '';
  }

  onClose(): void {
    if (!this.isProcessing) {
      this.close.emit();
    }
  }

  onConfirm(): void {
    if (this.invoices.length > 0 && !this.isProcessing) {
      this.confirmPayment.emit(this.invoices);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isProcessing) {
      this.onClose();
    }
  }
}
