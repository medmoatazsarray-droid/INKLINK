import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierPage } from './panier-page';

describe('PanierPage', () => {
  let component: PanierPage;
  let fixture: ComponentFixture<PanierPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
