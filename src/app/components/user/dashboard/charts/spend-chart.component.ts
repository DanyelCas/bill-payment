import { Component, OnInit, Input } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-spend-chart',
  template: `
    <div class="chart-container">
      <div class="chart-wrapper" *ngIf="data.length > 0">
        <ngx-charts-bar-vertical
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
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
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
  @Input() data: any[] = [];

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
