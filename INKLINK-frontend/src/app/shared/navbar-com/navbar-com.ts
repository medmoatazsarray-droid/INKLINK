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
  isTransparent = false;
  isFloating = false;
  currentLogo = 'assets/icons/logo.svg';

  constructor(private elRef: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.updateStyle(url);
    });

    // Handle initial state
    this.updateStyle(this.router.url);
  }

  private updateStyle(url: string): void {
    // Both marketing and explore have no bg
    this.isTransparent = url === '/marketing-support' || url === '/explore-products';
    // Only marketing needs to absolute-float over the hero
    this.isFloating = url === '/marketing-support';
    
    // Choose logo: white for marketing-support hero, teal logo for others
    if (url === '/marketing-support') {
      this.currentLogo = 'assets/icons/logo final-03.png';
    } else {
      this.currentLogo = 'assets/icons/logo.svg';
    }
  }

  toggleCategory(event: Event): void {
    event.preventDefault();
    this.categoryOpen = !this.categoryOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.categoryOpen = false;
    }
  }
}
