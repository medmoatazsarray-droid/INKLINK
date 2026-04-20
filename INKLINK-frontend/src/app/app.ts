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
      const url = event.urlAfterRedirects || event.url;
      this.updateVisibility(url);
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
      url.includes('trouver-commande') ||
      url.includes('gestion-challenge') ||
      url.includes('ajouter-challenge') ||
      url.includes('sign-in') ||
      url.includes('login');

    // These routes use their own embedded navbar - hide the global one.
    // Check for 'product/' (for product detail), 'outfit', and 'detailed-product'.
    const hideNavbar = isAdminRoute || 
                       url.includes('product/') || 
                       url.includes('outfit') || 
                       url.includes('detailed-product');

    this.showFooter.set(!isAdminRoute);
    this.showNavbar.set(!hideNavbar);

    if (!hideNavbar) {
      this.initScrollReveal();
    }
  }

  private initScrollReveal() {
    // Small delay to allow Angular to finish rendering the new page
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once revealed, we don't need to observe it anymore
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });

      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));

      // Use MutationObserver to ensure dynamically loaded products are also captured
      const mutationObserver = new MutationObserver(() => {
        const newElements = document.querySelectorAll('.reveal');
        newElements.forEach(el => observer.observe(el));
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }, 500);
  }
}