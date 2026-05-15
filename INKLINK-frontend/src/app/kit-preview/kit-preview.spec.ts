import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitPreview } from './kit-preview';

describe('KitPreview', () => {
  let component: KitPreview;
  let fixture: ComponentFixture<KitPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
