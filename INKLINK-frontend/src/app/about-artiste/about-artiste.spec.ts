import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutArtiste } from './about-artiste';

describe('AboutArtiste', () => {
  let component: AboutArtiste;
  let fixture: ComponentFixture<AboutArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutArtiste]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutArtiste);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
