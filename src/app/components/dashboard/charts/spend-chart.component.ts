import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-spend-chart',
  template: `
    <div class="chart-container">
      <div class="header-controls">
        <div class="toggles">
          <button [class.active]="viewMode === 'bar'" (click)="viewMode = 'bar'">Por Servicio</button>
          <button [class.active]="viewMode === 'line'" (click)="viewMode = 'line'">Histórico</button>
        </div>
      </div>
      
      <div class="chart-wrapper" *ngIf="data.length > 0">
        <ngx-charts-bar-vertical
          *ngIf="viewMode === 'bar'"
          [scheme]="colorScheme"
          [results]="data"
          [xAxis]="true"
          [yAxis]="true"
          [legend]="false"
          [showXAxisLabel]="true"
          [showYAxisLabel]="true"
          xAxisLabel="Servicio"
          yAxisLabel="Monto (Bs)"
          [roundDomains]="true"
          [animations]="true">
        </ngx-charts-bar-vertical>

        <ngx-charts-line-chart
          *ngIf="viewMode === 'line'"
          [scheme]="colorScheme"
          [results]="lineData"
          [xAxis]="true"
          [yAxis]="true"
          [legend]="false"
          [showXAxisLabel]="true"
          [showYAxisLabel]="true"
          xAxisLabel="Mes"
          yAxisLabel="Gasto Total (Bs)"
          [autoScale]="true">
        </ngx-charts-line-chart>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .header-controls {
      display: flex;
      justify-content: flex-end; /* Align toggles to right */
      margin-bottom: 0.5rem;
    }
    .toggles {
      background: #f7fafc;
      padding: 0.25rem;
      border-radius: 8px;
      display: flex;
      gap: 0.5rem;

      button {
        border: none;
        background: transparent;
        padding: 0.3rem 0.6rem;
        border-radius: 6px;
        color: #718096;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          background: white;
          color: #4299e1;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          font-weight: 600;
        }
      }
    }
    .chart-wrapper {
      flex: 1;
      min-height: 0; /* Changed from 300px to 0 to allow shrinking */
      overflow: hidden; /* Important for auto-resize */
    }
  `]
})
export class SpendChartComponent implements OnInit {
  viewMode: 'bar' | 'line' = 'bar';

  // Data
  data: any[] = [];
  lineData: any[] = [];

  // Options
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4299e1', '#48BB78', '#ED8936', '#E53E3E']
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.dashboardService.getSpendByService(user.id).subscribe(data => {
        this.data = data;
      });

      this.dashboardService.getTrendData(user.id).subscribe(data => {
        this.lineData = data;
      });
    }
  }

  // Force chart resize on window resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    // Force Angular to detect changes
    this.cdr.detectChanges();
  }
}
