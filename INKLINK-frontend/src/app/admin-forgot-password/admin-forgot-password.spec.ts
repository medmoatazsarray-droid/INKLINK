import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForgotPassword } from './admin-forgot-password';

describe('AdminForgotPassword', () => {
  let component: AdminForgotPassword;
  let fixture: ComponentFixture<AdminForgotPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminForgotPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
