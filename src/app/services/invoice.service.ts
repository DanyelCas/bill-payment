import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getInvoicesByCustomerId(customerId: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices?customerId=${customerId}`);
  }
}
