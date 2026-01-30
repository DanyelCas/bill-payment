import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { AuthService } from '../../services/auth.service';
import { InvoiceEventsService } from '../../services/invoice-events.service';
import { InvoiceTableComponent } from '../invoice-table/invoice-table.component';
import { ReceiptService } from '../../services/receipt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  @ViewChild(InvoiceTableComponent) invoiceTable!: InvoiceTableComponent;
  invoices: Invoice[] = [];
  isLoading = false;
  error: string | null = null;
  hasSearched = false;

  // Modal state
  selectedInvoicesForPayment: Invoice[] = [];
  isPaymentModalOpen = false;
  isProcessingPayment = false;
  paymentSuccess = false;
  paymentError: string | null = null;
  currentCustomerId: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private invoiceEventsService: InvoiceEventsService,
    private receiptService: ReceiptService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentCustomerId = user.id;
      this.loadInvoices(user.id);
    }
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

    // Validar que no haya meses anteriores pendientes del mismo servicio
    const validationError = this.validateSequentialPayment([invoice]);
    if (validationError) {
      Swal.fire({
        icon: 'warning',
        title: 'Pago no permitido',
        html: validationError,
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'swal2-confirm-primary'
        }
      });
      return;
    }

    this.selectedInvoicesForPayment = [invoice];
    this.isPaymentModalOpen = true;
    this.paymentSuccess = false;
    this.paymentError = null;
  }

  onClosePaymentModal(): void {
    this.isPaymentModalOpen = false;
    this.selectedInvoicesForPayment = [];
    this.paymentSuccess = false;
    this.paymentError = null;
  }

  onConfirmPayment(invoices: Invoice[]): void {
    this.isProcessingPayment = true;
    this.paymentError = null;
    this.paymentSuccess = false;

    const ids = invoices.map((i) => i.id);

    this.invoiceService.payInvoices(ids).subscribe({
      next: (updatedInvoices) => {
        // Actualizar facturas localmente
        updatedInvoices.forEach((updated) => {
          const index = this.invoices.findIndex((inv) => inv.id === updated.id);
          if (index !== -1) {
            this.invoices[index] = { ...this.invoices[index], estado: 'pagado' };
          }
        });

        this.isProcessingPayment = false;
        this.paymentSuccess = true;

        // Notificar que se completó el pago para actualizar el dashboard
        this.invoiceEventsService.notifyPaymentCompleted();

        // Limpiar selección en la tabla
        if (this.invoiceTable) {
          this.invoiceTable.clearSelection();
        }

        // Crear recibo
        const userId = this.currentCustomerId || 'UNKNOWN';
        this.receiptService.createReceipt(
          updatedInvoices,
          userId,
          'QR / Transferencia'
        ).subscribe({
          next: (receipt) => {
            // Cerrar modal y mostrar SweetAlert con opción de descargar
            this.onClosePaymentModal();

            Swal.fire({
              title: '¡Pago Exitoso!',
              html: `
                <p>Se han procesado ${updatedInvoices.length} factura(s) correctamente.</p>
                <div style="margin-top: 15px; font-size: 0.9em; color: #555;">
                  Código de Recibo: <strong>${receipt.id}</strong>
                </div>
              `,
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Descargar Recibo',
              cancelButtonText: 'Cerrar',
              customClass: {
                confirmButton: 'swal2-confirm-success',
                cancelButton: 'swal2-cancel-gray' // Need to ensure this class exists or use default
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.receiptService.generatePDF(receipt);
              }
            });
          },
          error: (err) => {
            console.error('Error creating receipt:', err);
            // Aun si falla el recibo, el pago fue exitoso
            this.onClosePaymentModal();
            Swal.fire({
              title: '¡Pago Exitoso!',
              text: `Se han procesado ${updatedInvoices.length} factura(s), pero hubo un error generando el recibo.`,
              icon: 'warning',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal2-confirm-primary'
              }
            });
          }
        });
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.paymentSuccess = false;
        this.paymentError =
          err?.message ||
          'Error al procesar el pago. Por favor, intente nuevamente.';
        console.error('Error paying invoice:', err);

        Swal.fire({
          title: 'Error',
          text: this.paymentError || 'Ocurrió un error inesperado.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'swal2-confirm-primary' // Reverting to primary for error
          }
        });
      },
    });
  }

  onPayInvoices(invoices: Invoice[]): void {
    if (invoices.length === 0) return;

    // Validación movida a Smart Selection en la tabla.
    // Solo permitimos el pago si hay facturas seleccionadas.


    this.selectedInvoicesForPayment = invoices;
    this.isPaymentModalOpen = true;
    this.paymentSuccess = false;
    this.paymentError = null;
  }

  /**
   * Valida que no se puedan pagar facturas saltando meses anteriores del mismo servicio
   */
  private validateSequentialPayment(invoicesToPay: Invoice[]): string | null {
    // Usar Set<string> para búsqueda eficiente y comparación segura de IDs
    const invoicesToPayIds = new Set(invoicesToPay.map(i => String(i.id)));

    for (const invoice of invoicesToPay) {
      // Buscar pendientes anteriores
      const earlierPending = this.findEarlierPendingInvoices(invoice);

      // Filtrar las que YA están seleccionadas para pago en esta transacción
      const missingEarlier = earlierPending.filter(inv => !invoicesToPayIds.has(String(inv.id)));

      if (missingEarlier.length > 0) {
        return `<div style="text-align: left;">
          <p>No puedes pagar <strong>${invoice.servicio}</strong> de <strong>${invoice.periodo}</strong> porque tienes facturas pendientes de meses anteriores no seleccionadas:</p>
          <ul style="margin: 10px 0;">
            ${missingEarlier.map(inv => `<li>${inv.periodo} - ${this.formatCurrency(inv.monto)}</li>`).join('')}
          </ul>
          <p style="margin-top: 10px;"><em>Por favor, selecciona también los meses anteriores para proceder.</em></p>
        </div>`;
      }
    }

    return null;
  }

  /**
   * Encuentra facturas pendientes anteriores del mismo servicio
   */
  private findEarlierPendingInvoices(invoice: Invoice): Invoice[] {
    const invoiceDate = this.parsePeriodo(invoice.periodo);

    return this.invoices.filter(inv => {
      // Mismo servicio, estado pendiente o vencida, y fecha anterior
      if (inv.servicio !== invoice.servicio) return false;
      if (inv.estado === 'pagado') return false;
      if (inv.id === invoice.id) return false;

      const invDate = this.parsePeriodo(inv.periodo);
      return invDate < invoiceDate;
    }).sort((a, b) => {
      const dateA = this.parsePeriodo(a.periodo);
      const dateB = this.parsePeriodo(b.periodo);
      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Convierte un periodo "Enero 2024" a Date
   */
  private parsePeriodo(periodo: string): Date {
    const meses: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    const parts = periodo.toLowerCase().split(' ');
    const mes = meses[parts[0]];
    const anio = parseInt(parts[1], 10);

    return new Date(anio, mes, 1);
  }

  /**
   * Formatea un número como moneda
   */
  private formatCurrency(amount: number): string {
    return 'Bs. ' + new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
