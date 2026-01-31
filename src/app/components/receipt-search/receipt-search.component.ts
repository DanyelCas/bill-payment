import { Component } from '@angular/core';
import { ReceiptService } from '../../services/receipt.service';
import { Receipt } from '../../models/receipt.model';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipt-search',
  templateUrl: './receipt-search.component.html',
  styleUrls: ['./receipt-search.component.scss']
})
export class ReceiptSearchComponent {
  searchId: string = '';
  isLoading = false;
  foundReceipt: Receipt | null = null;
  hasSearched = false;

  constructor(private receiptService: ReceiptService) { }

  onSearch(): void {
    if (!this.searchId.trim()) return;

    this.isLoading = true;
    this.hasSearched = true;
    this.foundReceipt = null;

    // Simulate network delay for better UX
    setTimeout(() => {
      this.receiptService.getReceiptById(this.searchId.trim())
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (receipts) => {
            if (receipts && receipts.length > 0) {
              this.foundReceipt = receipts[0];
            } else {
              this.foundReceipt = null;
            }
          },
          error: (err) => {
            console.error('Error finding receipt', err);
            Swal.fire('Error', 'Hubo un problema al buscar el comprobante', 'error');
          }
        });
    }, 600);
  }

  downloadPDF(): void {
    if (this.foundReceipt) {
      this.receiptService.generatePDF(this.foundReceipt);
      Swal.fire({
        icon: 'success',
        title: 'Descarga iniciada',
        text: 'Tu comprobante se está descargando.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  formatCurrency(val: number): string {
    return 'Bs. ' + new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(val);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}
