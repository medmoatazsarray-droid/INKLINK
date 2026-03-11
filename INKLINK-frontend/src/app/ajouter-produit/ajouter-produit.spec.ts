import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProduit } from './ajouter-produit';

describe('AjouterProduit', () => {
  let component: AjouterProduit;
  let fixture: ComponentFixture<AjouterProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterProduit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
