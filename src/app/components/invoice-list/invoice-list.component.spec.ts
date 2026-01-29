import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InvoiceListComponent } from './invoice-list.component';
import { InvoiceService } from '../../services/invoice.service';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceListComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [InvoiceService],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with customerId control', () => {
    expect(component.invoiceForm).toBeDefined();
    expect(component.invoiceForm.get('customerId')).toBeDefined();
  });

  it('should validate customerId as required', () => {
    const control = component.invoiceForm.get('customerId');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['required']).toBeTruthy();
  });
});
