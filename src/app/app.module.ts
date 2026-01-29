import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceSearchComponent } from './components/invoice-search/invoice-search.component';
import { InvoiceTableComponent } from './components/invoice-table/invoice-table.component';
import { InvoicePaymentComponent } from './components/invoice-payment/invoice-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceSearchComponent,
    InvoiceTableComponent,
    InvoicePaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
