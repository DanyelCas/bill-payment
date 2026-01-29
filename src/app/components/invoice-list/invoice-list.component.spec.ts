import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { InvoiceListComponent } from './invoice-list.component';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceSearchComponent } from '../invoice-search/invoice-search.component';
import { InvoiceTableComponent } from '../invoice-table/invoice-table.component';
import { InvoicePaymentComponent } from '../invoice-payment/invoice-payment.component';
import { Invoice } from '../../models/invoice.model';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;
  let invoiceService: jasmine.SpyObj<InvoiceService>;

  const mockInvoices: Invoice[] = [
    {
      id: 1,
      servicio: 'Electricidad',
      periodo: 'Enero 2024',
      monto: 1250.5,
      estado: 'pendiente',
    },
    {
      id: 2,
      servicio: 'Agua',
      periodo: 'Enero 2024',
      monto: 450.75,
      estado: 'pendiente',
    },
  ];

  beforeEach(async () => {
    const invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', [
      'getInvoices',
      'payInvoice',
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        InvoiceListComponent,
        InvoiceSearchComponent,
        InvoiceTableComponent,
        InvoicePaymentComponent,
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [{ provide: InvoiceService, useValue: invoiceServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    invoiceService = TestBed.inject(
      InvoiceService
    ) as jasmine.SpyObj<InvoiceService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty state', () => {
    expect(component.invoices).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
    expect(component.hasSearched).toBe(false);
  });

  it('should load invoices on search', () => {
    invoiceService.getInvoices.and.returnValue(of(mockInvoices));

    component.onSearch('123456');

    expect(invoiceService.getInvoices).toHaveBeenCalledWith('123456');
    expect(component.currentCustomerId).toBe('123456');
    expect(component.hasSearched).toBe(true);
  });

  it('should handle error when loading invoices', () => {
    const errorMessage = 'Error loading invoices';
    invoiceService.getInvoices.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.onSearch('123456');

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBe(false);
  });

  it('should open payment modal when pay invoice is called', () => {
    const invoice: Invoice = mockInvoices[0];
    component.onPayInvoice(invoice);

    expect(component.selectedInvoice).toEqual(invoice);
    expect(component.isPaymentModalOpen).toBe(true);
  });

  it('should not open modal if invoice is already paid', () => {
    const paidInvoice: Invoice = { ...mockInvoices[0], estado: 'pagado' };
    component.onPayInvoice(paidInvoice);

    expect(component.isPaymentModalOpen).toBe(false);
  });

  it('should close payment modal', () => {
    component.isPaymentModalOpen = true;
    component.selectedInvoice = mockInvoices[0];

    component.onClosePaymentModal();

    expect(component.isPaymentModalOpen).toBe(false);
    expect(component.selectedInvoice).toBeNull();
  });

  it('should process payment and update invoice', () => {
    const invoice: Invoice = mockInvoices[0];
    const updatedInvoice: Invoice = { ...invoice, estado: 'pagado' };
    component.invoices = [invoice];
    invoiceService.payInvoice.and.returnValue(of(updatedInvoice));

    component.onConfirmPayment(invoice);

    expect(invoiceService.payInvoice).toHaveBeenCalledWith(invoice.id);
    expect(component.invoices[0].estado).toBe('pagado');
  });
});
