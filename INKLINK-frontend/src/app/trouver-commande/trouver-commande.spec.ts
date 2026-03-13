import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrouverCommande } from './trouver-commande';

describe('TrouverCommande', () => {
  let component: TrouverCommande;
  let fixture: ComponentFixture<TrouverCommande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrouverCommande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrouverCommande);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
