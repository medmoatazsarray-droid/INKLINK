import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveDesign } from './interactive-design';

describe('InteractiveDesign', () => {
  let component: InteractiveDesign;
  let fixture: ComponentFixture<InteractiveDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveDesign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
