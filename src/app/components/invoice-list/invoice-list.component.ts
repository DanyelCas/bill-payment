import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  invoiceForm: FormGroup;
  invoices: Invoice[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,12}$/)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const customerId = this.invoiceForm.get('customerId')?.value;
      this.loadInvoices(customerId);
    }
  }

  private loadInvoices(customerId: string): void {
    this.isLoading = true;
    this.error = null;
    this.invoices = [];

    this.invoiceService.getInvoicesByCustomerId(customerId).subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las facturas. Verifique que el mock API esté ejecutándose.';
        this.isLoading = false;
        console.error('Error loading invoices:', err);
      },
    });
  }

  get customerIdControl() {
    return this.invoiceForm.get('customerId');
  }

  get customerIdErrors() {
    const control = this.customerIdControl;
    if (control && control.touched && control.errors) {
      if (control.errors['required']) {
        return 'El ID de cliente es obligatorio';
      }
      if (control.errors['pattern']) {
        return 'El ID debe tener entre 6 y 12 caracteres alfanuméricos';
      }
    }
    return null;
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
      vencido: 'estado-vencido',
    };
    return estadoMap[estado] || '';
  }
}
