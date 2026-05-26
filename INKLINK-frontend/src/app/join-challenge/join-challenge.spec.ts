import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinChallenge } from './join-challenge';

describe('JoinChallenge', () => {
  let component: JoinChallenge;
  let fixture: ComponentFixture<JoinChallenge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinChallenge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinChallenge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
