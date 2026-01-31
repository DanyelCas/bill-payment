import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-widget',
  template: `
    <div class="widget-card" [class]="color">
      <div class="icon-wrapper">
        <lucide-icon [name]="icon" [size]="24"></lucide-icon>
      </div>
      <div class="content">
        <h4 class="title">{{ title }}</h4>
        <div class="value">{{ value }}</div>
        <div class="subtext" *ngIf="subtext">{{ subtext }}</div>
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
      }

      &.orange .icon-wrapper { background: var(--color-warning-bg); color: var(--color-warning); }
      &.blue .icon-wrapper { background: var(--color-primary-bg); color: var(--color-primary); }
      &.purple .icon-wrapper { background: var(--color-secondary-bg); color: var(--color-secondary); }
      &.green .icon-wrapper { background: var(--color-success-bg); color: var(--color-success); }
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .content {
      flex: 1;
      .title {
        color: #718096;
        font-size: 0.85rem;
        margin: 0 0 0.25rem 0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .value {
        color: #2d3748;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.2;
      }
      .subtext {
        color: #a0aec0;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }
    }
  `]
})
export class SummaryWidgetComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() subtext: string | null | undefined = '';
  @Input() icon: string = '';
  @Input() color: 'orange' | 'blue' | 'purple' | 'green' = 'blue';
}
