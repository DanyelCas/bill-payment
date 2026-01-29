import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
})
export class InvoiceTableComponent {
  @Input() invoices: Invoice[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Input() hasSearched = false;

  @Output() payInvoice = new EventEmitter<Invoice>();

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

  isPending(invoice: Invoice): boolean {
    return invoice.estado === 'pendiente';
  }

  onPayClick(invoice: Invoice): void {
    this.payInvoice.emit(invoice);
  }
}
