import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-search',
  templateUrl: './invoice-search.component.html',
  styleUrls: ['./invoice-search.component.scss'],
})
export class InvoiceSearchComponent {
  @Input() isLoading = false;
  @Output() search = new EventEmitter<string>();

  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const customerId = this.invoiceForm.get('customerId')?.value;
      this.search.emit(customerId);
    } else {
      this.invoiceForm.markAllAsTouched();
    }
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
        return 'El ID debe contener solo números';
      }
    }
    return null;
  }
}
