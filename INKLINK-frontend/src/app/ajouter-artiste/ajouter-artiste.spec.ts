import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterArtiste } from './ajouter-artiste';

describe('AjouterArtiste', () => {
  let component: AjouterArtiste;
  let fixture: ComponentFixture<AjouterArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterArtiste]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterArtiste);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
