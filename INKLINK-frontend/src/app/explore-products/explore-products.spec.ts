import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreProducts } from './explore-products';

describe('ExploreProducts', () => {
  let component: ExploreProducts;
  let fixture: ComponentFixture<ExploreProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
