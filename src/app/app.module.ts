import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceSearchComponent } from './components/invoice-search/invoice-search.component';
import { InvoiceTableComponent } from './components/invoice-table/invoice-table.component';
import { InvoicePaymentComponent } from './components/invoice-payment/invoice-payment.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SummaryWidgetComponent } from './components/dashboard/widgets/summary-widget.component';
import { UpcomingDuesWidgetComponent } from './components/dashboard/widgets/upcoming-dues-widget.component';
import { AverageSpendWidgetComponent } from './components/dashboard/widgets/average-spend-widget.component';
import { SpendChartComponent } from './components/dashboard/charts/spend-chart.component';
import { InvoiceStatusChartComponent } from './components/dashboard/charts/invoice-status-chart.component';
import { MultiSelectDropdownComponent } from './components/ui/multi-select-dropdown/multi-select-dropdown.component';
import { LucideAngularModule, CircleAlert, AlertCircle, CalendarClock, TrendingUp, PiggyBank, CircleCheck, FileText, LayoutGrid, List, CreditCard, Package, Inbox, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CircleUser, Receipt, ChartColumn, ChartPie } from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceSearchComponent,
    InvoiceTableComponent,
    InvoicePaymentComponent,
    LoginComponent,
    AdminDashboardComponent,
    DashboardComponent,
    SummaryWidgetComponent,
    UpcomingDuesWidgetComponent,
    AverageSpendWidgetComponent,
    SpendChartComponent,
    SpendChartComponent,
    InvoiceStatusChartComponent,
    MultiSelectDropdownComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    LucideAngularModule.pick({ CircleAlert, AlertCircle, CalendarClock, TrendingUp, PiggyBank, CircleCheck, FileText, LayoutGrid, List, CreditCard, Package, Inbox, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CircleUser, Receipt, ChartColumn, ChartPie })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
