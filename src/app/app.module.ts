import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Auth Components
import { LoginComponent } from './components/auth/login/login.component';

// User Components
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { SummaryWidgetComponent } from './components/user/dashboard/widgets/summary-widget.component';
import { UpcomingDuesWidgetComponent } from './components/user/dashboard/widgets/upcoming-dues-widget.component';
import { AverageSpendWidgetComponent } from './components/user/dashboard/widgets/average-spend-widget.component';
import { SpendChartComponent } from './components/user/dashboard/charts/spend-chart.component';
import { InvoiceStatusChartComponent } from './components/user/dashboard/charts/invoice-status-chart.component';
import { InvoiceListComponent } from './components/user/invoices/invoice-list/invoice-list.component';
import { InvoiceSearchComponent } from './components/user/invoices/invoice-search/invoice-search.component';
import { InvoiceTableComponent } from './components/user/invoices/invoice-table/invoice-table.component';
import { InvoicePaymentComponent } from './components/user/invoices/invoice-payment/invoice-payment.component';
import { ReceiptSearchComponent } from './components/user/receipts/receipt-search/receipt-search.component';

// Admin Components
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminInvoicesComponent } from './components/admin/admin-invoices/admin-invoices.component';

// Shared Components
import { MultiSelectDropdownComponent } from './components/shared/ui/multi-select-dropdown/multi-select-dropdown.component';
import { TabsComponent } from './components/shared/ui/tabs/tabs.component';
import { TableComponent } from './components/shared/ui/table/table.component';
import { LucideAngularModule, CircleAlert, CalendarClock, TrendingUp, PiggyBank, CircleCheck, FileText, LayoutGrid, List, CreditCard, Package, Inbox, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CircleUser, Receipt, ChartColumn, ChartPie, Search, Trash2, Pencil, Plus, X, UserPlus, FilePlus, Users, UserCheck, UserMinus } from 'lucide-angular';

import { TableTemplateDirective } from './components/shared/ui/table/table-template.directive';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceSearchComponent,
    InvoiceTableComponent,
    InvoicePaymentComponent,
    LoginComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminInvoicesComponent,
    DashboardComponent,
    SummaryWidgetComponent,
    UpcomingDuesWidgetComponent,
    AverageSpendWidgetComponent,
    SpendChartComponent,
    InvoiceStatusChartComponent,
    MultiSelectDropdownComponent,
    MultiSelectDropdownComponent,
    TabsComponent,
    TableComponent,
    TableTemplateDirective,
    ReceiptSearchComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    LucideAngularModule.pick({ CircleAlert, CalendarClock, TrendingUp, PiggyBank, CircleCheck, FileText, LayoutGrid, List, CreditCard, Package, Inbox, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CircleUser, Receipt, ChartColumn, ChartPie, Search, Trash2, Pencil, Plus, X, UserPlus, FilePlus, Users, UserCheck, UserMinus })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
