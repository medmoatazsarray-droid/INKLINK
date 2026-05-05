import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistePage } from './artiste-page';

describe('ArtistePage', () => {
  let component: ArtistePage;
  let fixture: ComponentFixture<ArtistePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
