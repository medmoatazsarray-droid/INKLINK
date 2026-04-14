import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPayment } from './order-payment';

describe('OrderPayment', () => {
  let component: OrderPayment;
  let fixture: ComponentFixture<OrderPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
