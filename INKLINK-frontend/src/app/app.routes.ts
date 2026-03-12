import { Routes } from '@angular/router';
import { AdminLogin } from './admin-login/admin-login';
import { Home } from './home/home';
import { AdminForgotPasswordComponent } from './admin-forgot-password/admin-forgot-password';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AjouterProduit } from './ajouter-produit/ajouter-produit';
import { GestionProduits } from './gestion-produits/gestion-produits';
import { Orders } from './ordres/ordres';
import { Rapports } from './rapports/rapports';
import { Parametres } from './parametres/parametres';
import { adminAuthGuard } from './admin-auth.guard';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin-login', component: AdminLogin },
  { path: 'admin/forgot-password', component: AdminForgotPasswordComponent },
  { path: 'dashboard', component: AdminDashboard, canActivate: [adminAuthGuard] },
  { path: 'gestion-produits', component: GestionProduits, canActivate: [adminAuthGuard] },
  { path: 'ajouter-produit', component: AjouterProduit, canActivate: [adminAuthGuard] },
  { path: 'ajouter-produit/:id', component: AjouterProduit, canActivate: [adminAuthGuard] },
  { path: 'ordres', component: Orders, canActivate: [adminAuthGuard] },
  { path: 'rapports', component: Rapports, canActivate: [adminAuthGuard] },
  { path: 'parametres', component: Parametres, canActivate: [adminAuthGuard] }
];
