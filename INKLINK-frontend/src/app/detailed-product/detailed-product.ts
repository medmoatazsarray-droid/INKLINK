import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PartnersComponent } from '../shared/partners/partners';
import { SearchBar } from '../shared/search-bar/search-bar';
import { NavbarCom } from '../shared/navbar-com/navbar-com';
import { ProductService, Product } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-detailed-product',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, RouterLink, SearchBar, PartnersComponent, NavbarCom],
  templateUrl: './detailed-product.html',
  styleUrl: './detailed-product.css',
})
export class DetailedProduct implements OnInit {
  currentProduct: Product | null = null;
  selectedDimension: string = '50x90';
  selectedPrinting: 'front' | 'front-back' = 'front-back';
  customisationFront: 'upload' | 'artist' = 'upload';
  customisationBack: 'upload' | 'artist' = 'upload';
  quantity: number = 100;
  frontDesignFile?: File;
  backDesignFile?: File;

  customisedByClients: any[] = [];
  similarProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
      // Fallback or default if needed
      this.loadProductsFallback();
    }
  }

  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.currentProduct = product;
        this.loadRelatedProducts(product.id_categorie);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loadProductsFallback();
      }
    });
  }

  private loadRelatedProducts(categoryId: number): void {
    // Similar products from same category
    this.productService.getProductsByCategory(categoryId).subscribe((products) => {
      this.similarProducts = products
        .slice(0, 8)
        .map(p => this.formatProduct(p));
    });

    // Customised by clients - Using latest products as placeholder
    this.productService.getAllProducts().subscribe((products) => {
      this.customisedByClients = products
        .slice(0, 8)
        .reverse()
        .map(p => this.formatProduct(p));
    });
  }

  private loadProductsFallback(): void {
    this.productService.getAllProducts().subscribe((products) => {
      if (products.length > 0) {
        this.similarProducts = products.slice(0, 6).map(p => this.formatProduct(p));
        this.customisedByClients = products.slice(6, 12).map(p => this.formatProduct(p));
      }
    });
  }

  private formatProduct(p: Product) {
    return {
      name: p.nom,
      price: Number(p.prixBase).toFixed(2),
      image: p.image?.startsWith('http') || p.image?.startsWith('assets')
        ? p.image
        : `http://localhost:3001${p.image}`
    };
  }

  onPrintingChange(): void {
    this.customisationFront = 'upload';
    this.customisationBack = 'upload';
    this.frontDesignFile = undefined;
    this.backDesignFile = undefined;
  }

  useTemplate(side: 'front' | 'back'): void {
    if (side === 'front') {
      this.customisationFront = 'artist';
      this.frontDesignFile = undefined;
    } else {
      this.customisationBack = 'artist';
      this.backDesignFile = undefined;
    }
  }

  OnPrintingChange(): void {
    this.onPrintingChange();
  }

  UseTemplate(side: 'front' | 'back'): void {
    this.useTemplate(side);
  }

  addTocart(): void {
    this.addToCart();
  }

  increaseQty(): void {
    this.quantity = Math.min(100, this.quantity + 10);
  }

  decreaseQty(): void {
    this.quantity = Math.max(0, this.quantity - 10);
  }

  onDesignSelected(event: Event, side: 'front' | 'back'): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    if (side === 'front') {
      this.customisationFront = 'upload';
      this.frontDesignFile = file;
    } else {
      this.customisationBack = 'upload';
      this.backDesignFile = file;
    }

    if (input) input.value = '';
  }

  clearDesign(side: 'front' | 'back'): void {
    if (side === 'front') this.frontDesignFile = undefined;
    else this.backDesignFile = undefined;
  }

  private get dimensionUnitPrice(): number {
    // TND per card (example pricing).
    switch (this.selectedDimension) {
      case '50x90':
        return 0.15;
      case '55x85':
        return 0.17;
      case '60x90':
        return 0.2;
      default:
        return 0.15;
    }
  }

  get unitPrice(): number {
    const base = this.currentProduct?.prixBase || 0.15; // default fallback
    const printingMultiplier = this.selectedPrinting === 'front-back' ? 1.55 : 1;

    const sideCustomisationFee = 0.05;
    const customisationFee =
      (this.customisationFront === 'artist' ? sideCustomisationFee : 0) +
      (this.selectedPrinting === 'front-back' && this.customisationBack === 'artist'
        ? sideCustomisationFee
        : 0);

    return base * printingMultiplier + customisationFee;
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }

  scrollLeft(kind: 'clients' | 'similar'): void {
    this.scrollCarousel(kind, -1);
  }

  scrollRight(kind: 'clients' | 'similar'): void {
    this.scrollCarousel(kind, 1);
  }

  private scrollCarousel(kind: 'clients' | 'similar', direction: -1 | 1): void {
    const el = document.querySelector(`[data-carousel='${kind}']`) as HTMLElement | null;
    if (!el) return;

    const amount = Math.max(240, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  addToCart(): void {
    console.log('Added to cart:', {
      dimension: this.selectedDimension,
      printing: this.selectedPrinting,
      customisationFront: this.customisationFront,
      customisationBack: this.customisationBack,
      frontDesign: this.frontDesignFile?.name ?? null,
      backDesign: this.backDesignFile?.name ?? null,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
    });
  }


}
