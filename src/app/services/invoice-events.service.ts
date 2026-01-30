import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvoiceEventsService {
    private paymentCompletedSubject = new Subject<void>();

    // Observable que los componentes pueden suscribirse para recibir notificaciones
    paymentCompleted$ = this.paymentCompletedSubject.asObservable();

    // Método para notificar que se completó un pago
    notifyPaymentCompleted(): void {
        this.paymentCompletedSubject.next();
    }
}
