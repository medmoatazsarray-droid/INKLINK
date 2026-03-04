import { Routes } from '@angular/router';
import { AdminLogin } from './admin-login/admin-login';
import { Home } from './home/home';
import { AdminForgotPasswordComponent } from './admin-forgot-password/admin-forgot-password';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin/forgot-password', component: AdminForgotPasswordComponent },
  { path: 'admin/reset-password', component: AdminResetPasswordComponent },
  { path: 'admin', component: AdminLogin }
];
