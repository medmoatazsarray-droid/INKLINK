import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionArtistes } from './gestion-artistes';

describe('GestionArtistes', () => {
  let component: GestionArtistes;
  let fixture: ComponentFixture<GestionArtistes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionArtistes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionArtistes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
