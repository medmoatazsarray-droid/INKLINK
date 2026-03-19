import { Component, signal, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Footer } from './shared/footer/footer';
import { NavbarCom } from './shared/navbar-com/navbar-com';

@Component({
  selector: 'app-root', 
  standalone: true,
  imports: [RouterOutlet, Footer, NavbarCom],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('INKLINK-frontend');
  protected showFooter = signal(true);
  protected showNavbar = signal(true);
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateVisibility(event.urlAfterRedirects || event.url);
    });

    // Handle initial navigation visibility on page refresh
    // We use a small timeout to ensure the router has parsed the initial URL
    setTimeout(() => {
      this.updateVisibility(this.router.url);
    }, 0);
  }

  private updateVisibility(url: string) {
    if (!url) return;
    
    const isAdminRoute = 
      url.includes('admin') || 
      url.includes('dashboard') || 
      url.includes('gestion-produits') || 
      url.includes('ajouter-produit') || 
      url.includes('ordres') || 
      url.includes('rapports') || 
      url.includes('parametres') || 
      url.includes('trouver-commande');
    
    this.showFooter.set(!isAdminRoute);
    this.showNavbar.set(!isAdminRoute);
  }
}