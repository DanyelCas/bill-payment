import { Component, OnInit, Input } from '@angular/core';
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
      justify-content: flex-end;
      margin-bottom: 0.5rem;
      flex-shrink: 0;
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
      min-height: 0;
      overflow: hidden;
      position: relative;
    }
  `]
})
export class SpendChartComponent implements OnInit {
  viewMode: 'bar' | 'line' = 'bar';

  @Input() data: any[] = [];
  lineData: any[] = [];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4299e1', '#48BB78', '#ED8936', '#E53E3E']
  };

  ngOnInit(): void {
    // Data is passed from parent
  }
}
