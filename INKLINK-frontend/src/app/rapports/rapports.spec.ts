import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rapports } from './rapports';

describe('Rapports', () => {
  let component: Rapports;
  let fixture: ComponentFixture<Rapports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rapports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rapports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
