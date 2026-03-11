import { Routes } from '@angular/router';
import { AdminLogin } from './admin-login/admin-login';
import { Home } from './home/home';
import { AdminForgotPasswordComponent } from './admin-forgot-password/admin-forgot-password';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AjouterProduit } from './ajouter-produit/ajouter-produit';
import { GestionProduits } from './gestion-produits/gestion-produits';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin/forgot-password', component: AdminForgotPasswordComponent },
  { path: 'admin/reset-password', component: AdminResetPasswordComponent },
  { path: 'admin', component: AdminLogin },
  { path: 'dashboard', component: AdminDashboard },
  { path: 'gestion-produits', component: GestionProduits },
  { path: 'ajouter-produit', component: AjouterProduit },
  { path: 'ajouter-produit/:id', component: AjouterProduit }
];
