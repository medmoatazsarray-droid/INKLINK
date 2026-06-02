import { Routes } from '@angular/router';
import { AdminLogin } from './admin-login/admin-login';
import { Home } from './home/home';
import { AdminForgotPasswordComponent } from './admin-forgot-password/admin-forgot-password';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AjouterProduit } from './ajouter-produit/ajouter-produit';
import { GestionProduits } from './gestion-produits/gestion-produits';
import { AjouterArtiste } from './ajouter-artiste/ajouter-artiste';
import { GestionArtistes } from './gestion-artistes/gestion-artistes';


import { Orders } from './ordres/ordres';
import { Rapports } from './rapports/rapports';
import { Parametres } from './parametres/parametres';
import { adminAuthGuard } from './admin-auth.guard';
import { GestionChallenge } from './gestion-challenge/gestion-challenge';
import { AjouterChallenge } from './ajouter-challenge/ajouter-challenge';
import { TrouverCommandeComponent } from './trouver-commande/trouver-commande';
import { Footer } from './shared/footer/footer';
import { NavbarCom } from './shared/navbar-com/navbar-com';
import { ProductPage } from './product-page/product-page';
import { ExploreProducts } from './explore-products/explore-products';
import { ProductDetail } from './product-detail/product-detail';
import { SignIn } from './sign-in/sign-in';
import { Login } from './login/login';
import { Challenges } from './challenges/challenges';
import { OrderPayment } from './order-payment/order-payment';
import { DetailedProduct } from './detailed-product/detailed-product';
import { Profil } from './profil/profil';
import { EditProfile } from './edit-profile/edit-profile';
import { InteractiveDesignPage } from './interactive-design/interactive-design';
import { BusinessCardPayment } from './business-card-payment/business-card-payment';
import { ArtistePage } from './artiste-page/artiste-page';
import { AboutArtiste } from './about-artiste/about-artiste';
import { AiGeneratorPage } from './ai-generator-page/ai-generator-page';
import { KitPreview } from './kit-preview/kit-preview';
import { PanierPage } from './panier-page/panier-page';
import { AiAssistant } from './ai-assistant/ai-assistant';
import { CustomizingComponent } from './customizing/customizing.component';
import { PersonalProducts } from './personal-products/personal-products';
import { EventPage } from './event-page/event-page';
import { EventDetailComponent } from './event-detail/event-detail';
import { JoinChallenge} from './join-challenge/join-challenge';
import { BusinessCardWorkshopOne } from './business-card-workshop-one/business-card-workshop-one';

export const routes: Routes = [
    { path: '', component: Home, pathMatch: 'full' },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'sign-in', component: SignIn },
    { path: 'login', component: Login },
    { path: 'marketing-support', component: ProductPage },
    { path: 'events', component: EventPage },
    { path: 'events/:slug', component: EventDetailComponent },
    { path: 'product/:id', component: ProductDetail },
    { path: 'outfit', component: ProductDetail },
    { path: 'admin', redirectTo: 'admin-login', pathMatch: 'full' },
    { path: 'admin-login', component: AdminLogin },
    { path: 'admin/forgot-password', component: AdminForgotPasswordComponent },
    { path: 'dashboard', component: AdminDashboard, canActivate: [adminAuthGuard] },
    { path: 'gestion-produits', component: GestionProduits, canActivate: [adminAuthGuard] },
    { path: 'gestion-artistes', component: GestionArtistes, canActivate: [adminAuthGuard] },

    { path: 'ajouter-produit', component: AjouterProduit, canActivate: [adminAuthGuard] },
    { path: 'ajouter-artiste', component: AjouterArtiste, canActivate: [adminAuthGuard] },
    { path: 'ajouter-artiste/:id', component: AjouterArtiste, canActivate: [adminAuthGuard] },

    { path: 'ajouter-produit/:id', component: AjouterProduit, canActivate: [adminAuthGuard] },
    { path: 'ordres', component: Orders, canActivate: [adminAuthGuard] },
    { path: 'rapports', component: Rapports, canActivate: [adminAuthGuard] },
    { path: 'parametres', component: Parametres, canActivate: [adminAuthGuard] },
    { path: 'gestion-challenge', component: GestionChallenge, canActivate: [adminAuthGuard] },
    { path: 'ajouter-challenge', component: AjouterChallenge, canActivate: [adminAuthGuard] },
    { path: 'ajouter-challenge/:id', component: AjouterChallenge, canActivate: [adminAuthGuard] },
    { path: 'trouver-commande', component: TrouverCommandeComponent, canActivate: [adminAuthGuard] },
    { path: 'admin/reset-password', component: AdminResetPasswordComponent },
    { path: 'footer', component: Footer },
    { path: 'navbar-com', component: NavbarCom },
    { path: 'explore-products', component: ExploreProducts },
    { path: 'customizing', component: CustomizingComponent },
    { path: 'personal-products', component: PersonalProducts },
    { path: 'challenges', component: Challenges },
    { path: 'order-payment', component: OrderPayment },
    { path: 'detailed-product/:id', component: DetailedProduct },
    { path: 'detailed-product', component: DetailedProduct },
    { path: 'profil', component: Profil },
    { path: 'edit-profile', component: EditProfile },
    { path: 'interactive-design', component: InteractiveDesignPage },
    { path: 'business-card-workshop-one', component: BusinessCardWorkshopOne },
    { path: 'business-card-workshop-two', component: BusinessCardWorkshopOne },
    { path: 'business-card-payment', component: BusinessCardPayment },
    { path: 'artiste-creations', component: ArtistePage },
    { path: 'about-artiste/:id', component: AboutArtiste },
    { path: 'about-artiste', component: AboutArtiste },
    { path: 'ai-generator', component: AiGeneratorPage },
    { path: 'kit-preview', component: KitPreview },
    { path: 'panier', component: PanierPage },
    { path: 'ai-assistant', component: AiAssistant },
    { path: 'join-challenge', component: JoinChallenge },
];
