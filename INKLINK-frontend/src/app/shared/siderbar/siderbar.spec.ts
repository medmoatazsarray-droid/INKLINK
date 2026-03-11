import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Siderbar } from './siderbar';

describe('Siderbar', () => {
  let component: Siderbar;
  let fixture: ComponentFixture<Siderbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Siderbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Siderbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
