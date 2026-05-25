import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';

interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  colorName: string;
  size: string;
  quantity: number;
  printing: string;
  frontDesign: string | null;
  backDesign: string | null;
}

@Component({
  selector: 'app-order-payment',
  standalone: true,
  imports: [CommonModule, DecimalPipe, SearchBar, PartnersComponent],
  templateUrl: './order-payment.html',
  styleUrl: './order-payment.css',
})
export class OrderPayment implements OnInit {
  imgUrl = 'http://localhost:3001';
  product: OrderProduct = {
    id: 1,
    name: 'T-shirt',
    price: 15.00,
    image: 'assets/images/t-shirt-logo.png',
    color: '#CCD7DD',
    colorName: 'Light Gray',
    size: 'S',
    quantity: 1,
    printing: 'front',
    frontDesign: null,
    backDesign: null
  };

  get totalPrice(): number {
    return this.product.price * this.product.quantity;
  }

  get printingLabel(): string {
    switch (this.product.printing) {
      case 'front': return 'Front';
      case 'back': return 'Back';
      case 'both': return 'Front & Back';
      default: return this.product.printing;
    }
  }

  get maskImageCss(): string {
    return 'url("assets/images/t0.png")';
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    const orderStr = localStorage.getItem('pendingOrder');
    if (orderStr) {
      try {
        const data = JSON.parse(orderStr);
        this.product = {
          id: 1,
          name: data.name || 'T-shirt',
          price: data.price || 15.00,
          image: data.image || 'assets/images/t-shirt-logo.png',
          color: data.color || '#CCD7DD',
          colorName: data.colorName || 'Light Gray',
          size: data.size || 'S',
          quantity: data.quantity || 1,
          printing: data.printing || 'front',
          frontDesign: data.frontDesign || null,
          backDesign: data.backDesign || null
        };
      } catch (e) {
        console.error('Error parsing pendingOrder:', e);
      }
    }
  }

  getProductImage(): string {
    if (this.product.image && this.product.image.startsWith('/uploads')) {
      return this.imgUrl + this.product.image;
    }
    if (this.product.image) {
      return this.product.image;
    }
    return 'assets/images/t-shirt-logo.png';
  }

  goBack(): void {
    this.router.navigate(['/explore-products']);
  }

  confirmAndAddToCart(): void {
    this.router.navigate(['/panier']);
  }
}
