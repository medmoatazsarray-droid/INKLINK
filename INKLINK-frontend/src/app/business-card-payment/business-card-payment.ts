import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarCom } from '../shared/navbar-com/navbar-com';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';

@Component({
  selector: 'app-business-card-payment',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarCom, SearchBar, PartnersComponent],
  templateUrl: './business-card-payment.html',
  styleUrl: './business-card-payment.css',
})
export class BusinessCardPayment {
  product = {
    name : "Business card",
    quantity : 100,
    dimension : '50mm x 90mm (Vertical)',
    printing : 'Front and back',
    price : 180.00
  };
  constructor (private router : Router) {}
  goBack() {
    this.router.navigate(['/explore-products'])
  }
  confirmAndAddToCart() {
    this.router.navigate(['/cart']);
  }

}
