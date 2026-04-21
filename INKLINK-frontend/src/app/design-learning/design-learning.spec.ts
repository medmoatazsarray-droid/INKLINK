import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLearning } from './design-learning';

describe('DesignLearning', () => {
  let component: DesignLearning;
  let fixture: ComponentFixture<DesignLearning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignLearning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignLearning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
