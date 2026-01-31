import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoicePaymentComponent } from './invoice-payment.component';
import { Invoice } from '../../../../models/invoice.model';

describe('InvoicePaymentComponent', () => {
  let component: InvoicePaymentComponent;
  let fixture: ComponentFixture<InvoicePaymentComponent>;

  const mockInvoice: Invoice = {
    id: 1,
    servicio: 'Electricidad',
    periodo: 'Enero 2024',
    monto: 1250.5,
    estado: 'pendiente',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoicePaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1250.5);
    expect(formatted).toContain('$1,250.50');
  });

  it('should return correct estado class', () => {
    expect(component.getEstadoClass('pendiente')).toBe('estado-pendiente');
    expect(component.getEstadoClass('pagado')).toBe('estado-pagado');
    expect(component.getEstadoClass('unknown')).toBe('');
  });

  it('should emit close event when onClose is called', () => {
    component.isProcessing = false;
    spyOn(component.close, 'emit');

    component.onClose();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close event when processing', () => {
    component.isProcessing = true;
    spyOn(component.close, 'emit');

    component.onClose();

    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should emit confirmPayment event when onConfirm is called', () => {
    component.invoice = mockInvoice;
    component.isProcessing = false;
    spyOn(component.confirmPayment, 'emit');

    component.onConfirm();

    expect(component.confirmPayment.emit).toHaveBeenCalledWith(mockInvoice);
  });

  it('should not emit confirmPayment when invoice is null', () => {
    component.invoice = null;
    component.isProcessing = false;
    spyOn(component.confirmPayment, 'emit');

    component.onConfirm();

    expect(component.confirmPayment.emit).not.toHaveBeenCalled();
  });

  it('should not emit confirmPayment when processing', () => {
    component.invoice = mockInvoice;
    component.isProcessing = true;
    spyOn(component.confirmPayment, 'emit');

    component.onConfirm();

    expect(component.confirmPayment.emit).not.toHaveBeenCalled();
  });

  it('should close modal on backdrop click', () => {
    component.isProcessing = false;
    spyOn(component, 'onClose');
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: event.currentTarget });

    component.onBackdropClick(event);

    expect(component.onClose).toHaveBeenCalled();
  });

  it('should not close modal on backdrop click when processing', () => {
    component.isProcessing = true;
    spyOn(component, 'onClose');
    const event = new MouseEvent('click');

    component.onBackdropClick(event);

    expect(component.onClose).not.toHaveBeenCalled();
  });
});
