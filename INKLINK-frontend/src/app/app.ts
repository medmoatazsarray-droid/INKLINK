import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('INKLINK-frontend');
  protected showFooter = signal(true);
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      // Hide footer on admin/dashboard routes
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
    });
  }
}