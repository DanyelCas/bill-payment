import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { InvoiceEventsService } from '../../services/invoice-events.service';
import { User } from '../../models/user.model';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    stats: DashboardStats | null = null;
    loading = true;
    user: User | null = null;
    private paymentSubscription?: Subscription;

    constructor(
        private authService: AuthService,
        private dashboardService: DashboardService,
        private invoiceEventsService: InvoiceEventsService
    ) { }

    ngOnInit(): void {
        this.user = this.authService.getCurrentUser();
        if (this.user) {
            this.loadDashboardData(this.user.id);

            // Suscribirse a eventos de pago completado para refrescar el dashboard
            this.paymentSubscription = this.invoiceEventsService.paymentCompleted$
                .subscribe(() => {
                    if (this.user) {
                        this.loadDashboardData(this.user.id);
                    }
                });
        }
    }

    ngOnDestroy(): void {
        // Limpiar suscripción
        this.paymentSubscription?.unsubscribe();
    }

    loadDashboardData(userId: string): void {
        this.loading = true;
        this.dashboardService.getStats(userId)
            .pipe(finalize(() => this.loading = false))
            .subscribe(stats => {
                this.stats = stats;
            });
    }

    getSavingsMonthsShort(details: any): string {
        // Extract short month names: "Enero 2024" -> "Ene", "Febrero 2024" -> "Feb"
        const currentShort = details.currentMonth.split(' ')[0].substring(0, 3);
        const prevShort = details.prevMonth.split(' ')[0].substring(0, 3);
        return `${prevShort} vs ${currentShort}`;
    }
}
