import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiGeneratorPage } from './ai-generator-page';

describe('AiGeneratorPage', () => {
  let component: AiGeneratorPage;
  let fixture: ComponentFixture<AiGeneratorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiGeneratorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiGeneratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
