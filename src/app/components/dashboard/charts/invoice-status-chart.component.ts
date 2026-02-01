import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .chart-wrapper {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      position: relative;
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
export class InvoiceStatusChartComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];

  colorScheme: Color = {
    name: 'status',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#48BB78', '#ED8936', '#E53E3E']
  };

  ngOnInit(): void {
    this.applySortingIfNeeded();
  }

  ngOnChanges(): void {
    this.applySortingIfNeeded();
  }

  private applySortingIfNeeded(): void {
    if (this.data?.length) {
      this.data = this.sortData(this.data);
    }
  }

  private sortData(data: any[]): any[] {
    const order = ['Pagado', 'Pendiente', 'Vencida'];
    return data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }
}
