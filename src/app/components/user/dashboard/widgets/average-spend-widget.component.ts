import { Component, Input } from '@angular/core';

export interface MonthlySpend {
  month: string;
  amount: number;
}

@Component({
  selector: 'app-average-spend-widget',
  template: `
    <div class="widget-card">
      <div class="header">
        <div class="icon-wrapper">
          <lucide-icon name="trending-up" [size]="20"></lucide-icon>
        </div>
        <div class="header-content">
          <h4 class="title">GASTO PROMEDIO</h4>
        </div>
      </div>
      
      <div class="content">
        <div class="average-value">Bs. {{ averageAmount | number:'1.2-2' }}</div>
        <div class="period-text">Promedio mensual</div>
        
        <button class="btn-details" (click)="toggleDetails()" *ngIf="monthlyData.length > 0">
          {{ showDetails ? 'Ocultar' : 'Ver detalles' }}
          <lucide-icon [name]="showDetails ? 'chevron-up' : 'chevron-down'" [size]="14"></lucide-icon>
        </button>

        <!-- Monthly Breakdown -->
        <div class="details-panel animate__animated animate__fadeIn" *ngIf="showDetails && monthlyData.length > 0">
          <div class="details-header">Últimos 3 meses</div>
          <div class="month-item" *ngFor="let item of monthlyData">
            <div class="month-info">
              <span class="month-name">{{ item.month }}</span>
              <span class="month-amount">Bs. {{ item.amount | number:'1.2-2' }}</span>
            </div>
            <div class="month-bar">
              <div class="bar-fill" [style.width.%]="getBarWidth(item.amount)"></div>
            </div>
          </div>
        </div>

        <div class="no-data" *ngIf="monthlyData.length === 0">
          <span>Sin datos disponibles</span>
        </div>
      </div>
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
      background: var(--color-secondary-bg);
      color: var(--color-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      font-size: 0.8rem;
      color: #718096;
      margin: 0;
      font-weight: 600;
      text-transform: uppercase;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .average-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2d3748;
      line-height: 1;
    }

    .period-text {
      font-size: 0.75rem;
      color: #a0aec0;
      margin-top: 0.25rem;
      margin-bottom: 0.75rem;
    }

    .btn-details {
      background: none;
      border: none;
      color: var(--color-secondary);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: var(--transition-base);
      margin-bottom: 0.5rem;

      &:hover {
        text-decoration: underline;
        color: var(--color-secondary-dark);
      }
    }

    .details-panel {
      width: 100%;
      background: var(--color-secondary-bg);
      border-radius: var(--radius-md);
      padding: 0.75rem;
      margin-top: 0.5rem;

      .details-header {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-secondary-dark);
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .month-item {
        margin-bottom: 0.75rem;

        &:last-child {
          margin-bottom: 0;
        }

        .month-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;

          .month-name {
            font-size: 0.8rem;
            color: #4a5568;
            font-weight: 500;
          }

          .month-amount {
            font-size: 0.85rem;
            color: #2d3748;
            font-weight: 700;
          }
        }

        .month-bar {
          height: 6px;
          background: var(--color-gray-200);
          border-radius: 3px;
          overflow: hidden;

          .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
            border-radius: 3px;
            transition: var(--transition-slow);
          }
        }
      }
    }

    .no-data {
      font-size: 0.85rem;
      color: #a0aec0;
      font-style: italic;
    }
  `]
})
export class AverageSpendWidgetComponent {
  @Input() averageAmount: number = 0;
  @Input() monthlyData: MonthlySpend[] = [];
  showDetails = false;

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  getBarWidth(amount: number): number {
    if (this.monthlyData.length === 0) return 0;
    const maxAmount = Math.max(...this.monthlyData.map(m => m.amount));
    return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  }
}
