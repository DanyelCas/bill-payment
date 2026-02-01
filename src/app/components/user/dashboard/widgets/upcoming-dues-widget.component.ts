import { Component, Input } from '@angular/core';
import { Invoice } from '../../../../models/invoice.model';

@Component({
  selector: 'app-upcoming-dues-widget',
  template: `
    <div class="widget-card">
      <div class="header">
        <div class="icon-wrapper" [class.overdue-icon]="hasOverdueInvoices">
          <lucide-icon [name]="hasOverdueInvoices ? 'circle-alert' : 'calendar-clock'" [size]="20"></lucide-icon>
        </div>
        <div class="header-content">
          <h4 class="title">{{ widgetTitle }}</h4>
        </div>
      </div>
      
      <div class="content" *ngIf="invoices.length > 0; else noData">
        <!-- Single Invoice View -->
        <div class="single-invoice" *ngIf="invoices.length === 1">
          <div class="invoice-row">
            <span class="service">{{ invoices[0].servicio }}</span>
            <span class="amount">Bs. {{ invoices[0].monto | number:'1.2-2' }}</span>
          </div>
          <div class="invoice-meta">
            <span class="date">{{ invoices[0].fechaVencimiento | date:'dd MMM' }}</span>
            <span class="badge" [class.vencida]="isOverdue(invoices[0])">
               {{ isOverdue(invoices[0]) ? 'Vencida' : 'Pendiente' }}
            </span>
          </div>
        </div>

        <!-- Multiple Invoices View -->
        <div class="multiple-invoices" *ngIf="invoices.length > 1">
           <div class="multi-summary">
             <strong>{{ invoices.length }}</strong> {{ summaryText }}
           </div>
           <button class="btn-compact-view" (click)="toggleExpanded()">
             {{ isExpanded ? 'Ocultar' : 'Ver facturas' }}
             <lucide-icon [name]="isExpanded ? 'chevron-up' : 'chevron-right'" [size]="14"></lucide-icon>
           </button>
        </div>

        <!-- Expanded List with Enhanced Details -->
        <div class="expanded-list animate__animated animate__fadeIn" *ngIf="isExpanded && invoices.length > 1">
           <div class="detailed-list">
             <div class="detailed-item" *ngFor="let invoice of invoices" [class.overdue-item]="isOverdue(invoice)">
               <div class="item-header">
                 <span class="service-name">{{ invoice.servicio }}</span>
                 <span class="badge-mini" [class.vencida]="isOverdue(invoice)">
                   {{ isOverdue(invoice) ? 'Vencida' : 'Pendiente' }}
                 </span>
               </div>
               <div class="item-details">
                 <div class="detail-row">
                   <span class="label">Vencimiento:</span>
                   <span class="value">{{ invoice.fechaVencimiento | date:'dd/MM/yyyy' }}</span>
                 </div>
                 <div class="detail-row">
                   <span class="label">Monto:</span>
                   <span class="value amount-value">Bs. {{ invoice.monto | number:'1.2-2' }}</span>
                 </div>
                 <div class="detail-row" *ngIf="invoice.mes">
                   <span class="label">Período:</span>
                   <span class="value">{{ invoice.mes }} {{ invoice.anio }}</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

      </div>
      
      <ng-template #noData>
        <div class="no-data">
          <lucide-icon name="circle-check" [size]="24" class="check-icon"></lucide-icon>
          <span>al día</span>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .widget-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
      }
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .icon-wrapper {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--color-primary-bg);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-base);

      &.overdue-icon {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
    }

    .title {
      font-size: 0.8rem;
      color: #4a5568; // Darkened from #718096
      margin: 0;
      font-weight: 600;
      text-transform: uppercase;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .single-invoice {
      .invoice-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          color: #2d3748;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
      }
      .invoice-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #4a5568; // Darkened from #718096
      }
    }

    .multiple-invoices {
        text-align: center;
        .multi-summary {
            font-size: 0.9rem;
            color: #4a5568;
            margin-bottom: 0.5rem;
            strong { 
              color: #e53e3e;
              font-size: 1.1rem;
            }
        }
        .btn-compact-view {
            background: none;
            border: none;
            color: var(--color-primary);
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            padding: 0;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: var(--transition-base);
            &:hover { 
              text-decoration: underline;
              color: var(--color-primary-dark);
            }
        }
    }

    .detailed-list {
        margin-top: 0.75rem;
        background: var(--color-gray-50);
        border-radius: var(--radius-md);
        padding: 0.5rem;
        max-height: 200px;
        overflow-y: auto;
        
        .detailed-item {
            background: white;
            border-radius: var(--radius-sm);
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border-left: 3px solid var(--color-warning);
            transition: var(--transition-base);

            &:last-child { margin-bottom: 0; }

            &.overdue-item {
              border-left-color: var(--color-danger);
              background: var(--color-danger-bg);
            }

            &:hover {
              box-shadow: var(--shadow-sm);
            }

            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.4rem;
              padding-bottom: 0.3rem;
              border-bottom: 1px solid #e2e8f0;

              .service-name {
                font-weight: 600;
                font-size: 0.85rem;
                color: #2d3748;
              }

              .badge-mini {
                padding: 0.1rem 0.4rem;
                border-radius: var(--radius-sm);
                font-size: 0.6rem;
                font-weight: 700;
                background: var(--color-warning-bg);
                color: var(--color-warning);

                &.vencida {
                  background: var(--color-danger-bg);
                  color: var(--color-danger);
                }
              }
            }

            .item-details {
              .detail-row {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                margin-bottom: 0.2rem;
                
                &:last-child { margin-bottom: 0; }

                .label {
                  color: #4a5568; // Darkened from #718096
                  font-weight: 500;
                }

                .value {
                  color: #2d3748;
                  font-weight: 600;

                  &.amount-value {
                    color: var(--color-primary);
                  }
                }
              }
            }
        }
    }

    .badge {
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-sm);
      font-size: 0.65rem;
      font-weight: 700;
      background: var(--color-warning-bg);
      color: var(--color-warning);

      &.vencida {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
    }

    .no-data {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-success);
      font-weight: 600;
      font-size: 0.9rem;
    }
  `]
})
export class UpcomingDuesWidgetComponent {
  @Input() invoices: Invoice[] = [];
  isExpanded = false;

  get displayedInvoices(): Invoice[] {
    if (this.invoices.length <= 1 || this.isExpanded) {
      return this.invoices;
    }
    return [this.invoices[0]];
  }

  get overdueCount(): number {
    return this.invoices.filter(inv => this.isOverdue(inv)).length;
  }

  get upcomingCount(): number {
    return this.invoices.length - this.overdueCount;
  }

  get hasOverdueInvoices(): boolean {
    return this.overdueCount > 0;
  }

  get widgetTitle(): string {
    if (this.overdueCount > 0 && this.upcomingCount === 0) {
      return 'FACTURAS VENCIDAS';
    } else if (this.overdueCount > 0 && this.upcomingCount > 0) {
      return 'ATENCIÓN REQUERIDA';
    }
    return 'PRÓXIMO VENCIMIENTO';
  }

  get summaryText(): string {
    if (this.overdueCount > 0 && this.upcomingCount === 0) {
      return this.overdueCount === 1 ? 'factura vencida' : 'facturas vencidas';
    } else if (this.overdueCount === 0 && this.upcomingCount > 0) {
      return this.upcomingCount === 1 ? 'factura vence pronto' : 'facturas vencen pronto';
    } else if (this.overdueCount > 0 && this.upcomingCount > 0) {
      return `facturas (${this.overdueCount} vencida${this.overdueCount > 1 ? 's' : ''}, ${this.upcomingCount} próxima${this.upcomingCount > 1 ? 's' : ''})`;
    }
    return 'facturas';
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  isOverdue(invoice: Invoice): boolean {
    if (invoice.estado !== 'pendiente') return false;
    if (invoice.fechaVencimiento) {
      const fec = new Date(invoice.fechaVencimiento + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fec < hoy;
    }
    return false;
  }
}
