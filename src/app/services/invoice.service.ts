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

  getInvoices(customerId: string): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(`${this.apiUrl}/invoices?customerId=${customerId}`)
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
}
