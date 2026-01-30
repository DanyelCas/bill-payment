import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-invoice-status-chart',
  template: `
    <div class="chart-container">
      <div class="chart-wrapper" *ngIf="data.length > 0; else noData">
        <ngx-charts-pie-chart
          [scheme]="colorScheme"
          [results]="data"
          [gradient]="true"
          [legend]="false"
          [labels]="true"
          [doughnut]="true"
          [arcWidth]="0.25"
          [animations]="true"
          [tooltipDisabled]="false">
        </ngx-charts-pie-chart>
      </div>
      <ng-template #noData>
        <div class="no-data">
          <p>No hay datos disponibles</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 100%;
      min-height: 0; /* Changed from 300px to 0 */
      display: flex;
      flex-direction: column;
    }
    .chart-wrapper {
      flex: 1;
      overflow: hidden;
    }
    .no-data {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a0aec0;
      font-size: 0.9rem;
    }
  `]
})
export class InvoiceStatusChartComponent implements OnInit {
  data: any[] = [];

  // Color Scheme: Green (Paid), Orange (Pending), Red (Overdue)
  colorScheme: Color = {
    name: 'status',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#48BB78', '#ED8936', '#E53E3E'] // Green, Orange, Red
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.dashboardService.getInvoiceStatusDistribution(user.id).subscribe(data => {
        this.data = this.sortData(data);
      });
    }
  }

  // Ensure consistent order: Pagado, Pendiente, Vencida
  private sortData(data: any[]): any[] {
    const order = ['Pagado', 'Pendiente', 'Vencida'];
    return data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }

  // Force chart resize on window resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    // Force Angular to detect changes
    this.cdr.detectChanges();
  }
}
