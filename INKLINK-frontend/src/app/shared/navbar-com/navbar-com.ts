import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-com',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-com.html',
  styleUrl: './navbar-com.css',
})
export class NavbarCom implements OnInit {
  categoryOpen = false;
  servicesOpen = false;
  aboutOpen = false;
  isTransparent = false;
  isFloating = false;
  currentLogo = 'assets/icons/logo.svg';
  isLoggedIn = false;
  initials = '';
  settingsOpen = false;

  constructor(private elRef: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkLoginStatus(); // Re-check on every navigation
      const url = event.urlAfterRedirects || event.url;
      this.updateStyle(url);
    });

    // Handle initial state
    this.updateStyle(this.router.url);
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    const nom = localStorage.getItem('username');
    const prenom = localStorage.getItem('userFirstName');
    
    // Only consider logged in if both token and at least one name part exists
    this.isLoggedIn = !!token && (!!nom || !!prenom);
    
    if (this.isLoggedIn) {
      const first = prenom ? prenom[0] : '';
      const last = nom ? nom[0] : '';
      this.initials = (first + last).toUpperCase() || 'U'; // Fallback to 'U'
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userFirstName');
    this.isLoggedIn = false;
    this.settingsOpen = false;
    this.router.navigate(['/']); // Return to homepage as requested
  }

  private updateStyle(url: string): void {
    // Both marketing and explore have no bg
    this.isTransparent = url === '/marketing-support' || url === '/explore-products' || url === '/challenges';
    // Only marketing and challenges need to absolute-float over the hero
    this.isFloating = url === '/marketing-support' || url === '/challenges';
    
    // Choose logo: white for marketing-support & challenges hero, teal logo for others
    if (url === '/marketing-support' || url === '/challenges') {
      this.currentLogo = 'assets/icons/footer logo.svg';
    } else {
      this.currentLogo = 'assets/icons/logo.svg';
    }
  }

  toggleCategory(event: Event): void {
    event.preventDefault();
    this.categoryOpen = !this.categoryOpen;
    if (this.categoryOpen) {
      this.settingsOpen = false;
      this.servicesOpen = false;
      this.aboutOpen = false;
    }
  }

  toggleServices(event: Event): void {
    event.preventDefault();
    this.servicesOpen = !this.servicesOpen;
    if (this.servicesOpen) {
      this.categoryOpen = false;
      this.settingsOpen = false;
      this.aboutOpen = false;
    }
  }

  toggleAbout(event: Event): void {
    event.preventDefault();
    this.aboutOpen = !this.aboutOpen;
    if (this.aboutOpen) {
      this.categoryOpen = false;
      this.settingsOpen = false;
      this.servicesOpen = false;
    }
  }

  toggleSettings(event: Event): void {
    event.preventDefault();
    this.settingsOpen = !this.settingsOpen;
    if (this.settingsOpen) {
      this.categoryOpen = false;
      this.servicesOpen = false;
      this.aboutOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.categoryOpen = false;
      this.servicesOpen = false;
      this.aboutOpen = false;
      this.settingsOpen = false;
    }
  }
}
