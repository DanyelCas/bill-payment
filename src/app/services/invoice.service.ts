import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, delay, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) { }

  getInvoices(customerId?: string): Observable<Invoice[]> {
    const url = customerId
      ? `${this.apiUrl}/invoices?customerId=${customerId}`
      : `${this.apiUrl}/invoices`;
    return this.http
      .get<Invoice[]>(url)
      .pipe(
        catchError((error) => {
          console.error('Error fetching invoices:', error);
          return throwError(
            () =>
              new Error(
                'No se pudieron cargar las facturas. Por favor, verifique que el servidor mock esté ejecutándose.'
              )
          );
        })
      );
  }

  payInvoice(invoiceId: number): Observable<Invoice> {
    // Simular actualización en el servidor usando PATCH
    // JSON Server soporta PATCH para actualizar recursos
    return this.http
      .patch<Invoice>(`${this.apiUrl}/invoices/${invoiceId}`, {
        estado: 'pagado',
      })
      .pipe(
        delay(800), // Simular latencia de red
        catchError((error) => {
          console.error('Error paying invoice:', error);
          // Si el servidor no está disponible, simular el pago localmente
          // En producción, esto debería lanzar un error
          return throwError(
            () =>
              new Error(
                'No se pudo procesar el pago. Por favor, verifique que el servidor mock esté ejecutándose.'
              )
          );
        })
      );
  }

  payInvoices(invoiceIds: number[]): Observable<Invoice[]> {
    const requests = invoiceIds.map((id) => this.payInvoice(id));
    return forkJoin(requests);
  }

  createInvoice(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, invoice).pipe(
      catchError((error) => {
        console.error('Error creating invoice:', error);
        return throwError(
          () => new Error('No se pudo crear la factura.')
        );
      })
    );
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/invoices/${invoice.id}`, invoice).pipe(
      catchError((error) => {
        console.error('Error updating invoice:', error);
        return throwError(() => new Error('No se pudo actualizar la factura.'));
      })
    );
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/invoices/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting invoice:', error);
        return throwError(() => new Error('No se pudo eliminar la factura.'));
      })
    );
  }
}
