import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';

interface OrderProduct {
  id :number;
  name :string;
  price : number;
  image:string;
  color :string;
  size: string;
  quantity:number;
  printing:string;
}

@Component({
  selector: 'app-order-payment',
  standalone: true,
  imports: [CommonModule, DecimalPipe, SearchBar, PartnersComponent],
  templateUrl: './order-payment.html',
  styleUrl: './order-payment.css',
})
export class OrderPayment {
  imgUrl = 'http://localhost:3001';
  product : OrderProduct = {
    id : 1,
    name : 'T-shirt',
    price : 15.00,
    image : 'assets/images/t-shirt-logo.png',
    color : '#CCD7DD',
    size : 'S',
    quantity : 1,
    printing : 'playa'
  };
  get totalPrice(): number {
    return this.product.price * this.product.quantity;
  }
  constructor(private router : Router) {}
  goBack() : void {
    this.router.navigate(['/explore-products']);
  }
  confirmAndAddToCart() : void {
    this.router.navigate(['/cart']);
  }
}
