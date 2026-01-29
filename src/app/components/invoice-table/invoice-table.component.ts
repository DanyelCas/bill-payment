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
  @Output() payInvoices = new EventEmitter<Invoice[]>();

  selectedInvoiceIds = new Set<number>();


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

  toggleSelection(invoice: Invoice): void {
    if (this.selectedInvoiceIds.has(invoice.id)) {
      this.selectedInvoiceIds.delete(invoice.id);
    } else {
      this.selectedInvoiceIds.add(invoice.id);
    }
  }

  toggleAll(event: any): void {
    if (event.target.checked) {
      this.invoices
        .filter((inv) => this.isPending(inv))
        .forEach((inv) => this.selectedInvoiceIds.add(inv.id));
    } else {
      this.selectedInvoiceIds.clear();
    }
  }

  isAllSelected(): boolean {
    const pendingInvoices = this.invoices.filter((inv) => this.isPending(inv));
    return (
      pendingInvoices.length > 0 &&
      pendingInvoices.every((inv) => this.selectedInvoiceIds.has(inv.id))
    );
  }

  onPaySelected(): void {
    const selected = this.invoices.filter((inv) =>
      this.selectedInvoiceIds.has(inv.id)
    );
    this.payInvoices.emit(selected);
  }


  onPayClick(invoice: Invoice): void {
    this.payInvoice.emit(invoice);
  }
}
