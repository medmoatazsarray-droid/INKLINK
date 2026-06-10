import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PromoOfferService } from '../services/promo-offer.service';

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
  frontDesignScale?: number;
  frontDesignOffsetX?: number;
  frontDesignOffsetY?: number;
  frontDesignColor?: string;
  backDesignScale?: number;
  backDesignOffsetX?: number;
  backDesignOffsetY?: number;
  backDesignColor?: string;
  isMug?: boolean;
  productPreviewUrl?: string;
  maskImageCss?: string;
}

@Component({
  selector: 'app-order-payment',
  standalone: true,
  imports: [CommonModule, DecimalPipe, SearchBar, ],
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
    return this.product.maskImageCss || 'url("assets/images/t0.png")';
  }

  constructor(private router: Router, private promoOfferService: PromoOfferService) {}

  ngOnInit(): void {
    const orderStr = localStorage.getItem('pendingOrder');
    if (orderStr) {
      try {
        const data = JSON.parse(orderStr);
        this.product = {
          id: data.id || 1,
          name: data.name || 'T-shirt',
          price: data.price || 15.00,
          image: data.image || 'assets/images/t-shirt-logo.png',
          color: data.color || '#CCD7DD',
          colorName: data.colorName || 'Light Gray',
          size: data.size || 'S',
          quantity: data.quantity || 1,
          printing: data.printing || 'front',
          frontDesign: data.frontDesign || null,
          backDesign: data.backDesign || null,
          frontDesignScale: data.frontDesignScale || 1,
          frontDesignOffsetX: data.frontDesignOffsetX || 0,
          frontDesignOffsetY: data.frontDesignOffsetY || 0,
          frontDesignColor: data.frontDesignColor || '',
          backDesignScale: data.backDesignScale || 1,
          backDesignOffsetX: data.backDesignOffsetX || 0,
          backDesignOffsetY: data.backDesignOffsetY || 0,
          backDesignColor: data.backDesignColor || '',
          isMug: !!data.isMug,
          productPreviewUrl: data.productPreviewUrl || '',
          maskImageCss: data.maskImageCss || ''
        };
      } catch (e) {
        console.error('Error parsing pendingOrder:', e);
      }
    }
  }

  getInkTransform(side: 'front' | 'back'): string {
    const scale = side === 'front' ? (this.product.frontDesignScale || 1) : (this.product.backDesignScale || 1);
    const x = side === 'front' ? (this.product.frontDesignOffsetX || 0) : (this.product.backDesignOffsetX || 0);
    const y = side === 'front' ? (this.product.frontDesignOffsetY || 0) : (this.product.backDesignOffsetY || 0);
    return `translate(${x}px, ${y}px) scale(${scale})`;
  }

  editDesign(): void {
    if (this.product && this.product.id) {
      this.router.navigate(['/product', this.product.id]);
    } else {
      this.router.navigate(['/explore-products']);
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

  openPromoModal(): void {
    this.promoOfferService.openPromoModal();
  }
}
