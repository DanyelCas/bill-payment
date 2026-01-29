import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  isLoading = false;
  error: string | null = null;
  hasSearched = false;
  
  // Modal state
  selectedInvoice: Invoice | null = null;
  isPaymentModalOpen = false;
  isProcessingPayment = false;
  paymentSuccess = false;
  paymentError: string | null = null;
  currentCustomerId: string | null = null;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {}

  onSearch(customerId: string): void {
    this.currentCustomerId = customerId;
    this.loadInvoices(customerId);
  }

  private loadInvoices(customerId: string): void {
    this.isLoading = true;
    this.error = null;
    this.invoices = [];
    this.hasSearched = true;

    this.invoiceService.getInvoices(customerId).subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.isLoading = false;
      },
      error: (err) => {
        this.error =
          err?.message ||
          'Error al cargar las facturas. Por favor, verifique que el servidor mock esté ejecutándose.';
        this.isLoading = false;
        console.error('Error loading invoices:', err);
      },
    });
  }

  onPayInvoice(invoice: Invoice): void {
    if (invoice.estado === 'pagado') {
      return;
    }
    this.selectedInvoice = invoice;
    this.isPaymentModalOpen = true;
    this.paymentSuccess = false;
    this.paymentError = null;
  }

  onClosePaymentModal(): void {
    this.isPaymentModalOpen = false;
    this.selectedInvoice = null;
    this.paymentSuccess = false;
    this.paymentError = null;
  }

  onConfirmPayment(invoice: Invoice): void {
    this.isProcessingPayment = true;
    this.paymentError = null;
    this.paymentSuccess = false;

    this.invoiceService.payInvoice(invoice.id).subscribe({
      next: (updatedInvoice) => {
        // Actualizar la factura en la lista localmente
        const index = this.invoices.findIndex((inv) => inv.id === invoice.id);
        if (index !== -1) {
          this.invoices[index] = { ...this.invoices[index], estado: 'pagado' };
        }
        
        this.isProcessingPayment = false;
        this.paymentSuccess = true;
        
        // Cerrar modal después de un breve delay para mostrar éxito
        setTimeout(() => {
          this.onClosePaymentModal();
        }, 2000);
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.paymentSuccess = false;
        this.paymentError =
          err?.message ||
          'Error al procesar el pago. Por favor, intente nuevamente.';
        console.error('Error paying invoice:', err);
      },
    });
  }
}
