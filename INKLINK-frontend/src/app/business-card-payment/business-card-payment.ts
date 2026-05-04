import { Component } from '@angular/core';
import { Router} from '@angular/core'

@Component({
  selector: 'app-business-card-payment',
  imports: [],
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
