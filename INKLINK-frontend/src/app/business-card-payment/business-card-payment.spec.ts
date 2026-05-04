import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardPayment } from './business-card-payment';

describe('BusinessCardPayment', () => {
  let component: BusinessCardPayment;
  let fixture: ComponentFixture<BusinessCardPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCardPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCardPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
