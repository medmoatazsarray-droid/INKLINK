import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-com',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-com.html',
  styleUrl: './navbar-com.css',
})
export class NavbarCom {
  categoryOpen = false;

  constructor(private elRef: ElementRef) {}

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
