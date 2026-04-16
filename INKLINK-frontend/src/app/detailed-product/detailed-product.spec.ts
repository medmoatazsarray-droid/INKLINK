import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedProduct } from './detailed-product';

describe('DetailedProduct', () => {
  let component: DetailedProduct;
  let fixture: ComponentFixture<DetailedProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
