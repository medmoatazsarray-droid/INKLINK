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
  currentLogo = 'assets/icons/logo.svg';

  constructor(private elRef: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isTransparent = event.url === '/marketing-support';
      this.currentLogo = this.isTransparent ? 'assets/icons/logo final-03.png' : 'assets/icons/logo.svg';
    });

    // Handle initial state
    this.isTransparent = this.router.url === '/marketing-support';
    this.currentLogo = this.isTransparent ? 'assets/icons/logo final-03.png' : 'assets/icons/logo.svg';
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
