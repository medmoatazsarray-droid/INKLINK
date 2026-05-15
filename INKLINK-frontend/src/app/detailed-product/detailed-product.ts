import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { PartnersComponent } from '../shared/partners/partners';
import { SearchBar } from '../shared/search-bar/search-bar';
import { NavbarCom } from '../shared/navbar-com/navbar-com';
import { ProductService, Product } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-detailed-product',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, RouterLink, SearchBar, PartnersComponent, NavbarCom],
  templateUrl: './detailed-product.html',
  styleUrl: './detailed-product.css',
})
export class DetailedProduct implements OnInit, OnDestroy {
  currentProduct: Product | null = null;
  selectedDimension: string = '50x90';
  selectedPrinting: 'front' | 'front-back' = 'front-back';
  customisationFront: 'upload' | 'artist' = 'upload';
  customisationBack: 'upload' | 'artist' = 'upload';
  quantity: number = 100;
  frontDesignFile?: File;
  backDesignFile?: File;
  frontDesignPreviewUrl: string | null = null;
  backDesignPreviewUrl: string | null = null;
  private frontDesignObjectUrl: string | null = null;
  private backDesignObjectUrl: string | null = null;
  currentView: 'front' | 'back' = 'front';

  customisedByClients: any[] = [];
  similarProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
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

  ngOnDestroy(): void {
    this.revokeDesignObjectUrl('front');
    this.revokeDesignObjectUrl('back');
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
      id: p.id_produit,
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
    this.clearDesign('front');
    this.clearDesign('back');
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

    if (!file.type?.startsWith('image/')) {
      alert('Please select an image file.');
      if (input) input.value = '';
      return;
    }
    const lowerName = (file.name || '').toLowerCase();
    const looksLikeHeic =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      lowerName.endsWith('.heic') ||
      lowerName.endsWith('.heif');
    if (looksLikeHeic) {
      alert('HEIC/HEIF images are not supported by most browsers. Please upload a PNG or JPG.');
      if (input) input.value = '';
      return;
    }

    if (side === 'front') {
      this.customisationFront = 'upload';
      this.frontDesignFile = file;
      this.setDesignPreviewUrl('front', file);
    } else {
      this.customisationBack = 'upload';
      this.backDesignFile = file;
      this.setDesignPreviewUrl('back', file);
    }

    if (input) input.value = '';
  }

  clearDesign(side: 'front' | 'back'): void {
    if (side === 'front') {
      this.frontDesignFile = undefined;
      this.frontDesignPreviewUrl = null;
      this.revokeDesignObjectUrl('front');
    } else {
      this.backDesignFile = undefined;
      this.backDesignPreviewUrl = null;
      this.revokeDesignObjectUrl('back');
    }
  }

  private setDesignPreviewUrl(side: 'front' | 'back', file: File): void {
    this.revokeDesignObjectUrl(side);
    const objectUrl = URL.createObjectURL(file);
    if (side === 'front') {
      this.frontDesignObjectUrl = objectUrl;
      this.frontDesignPreviewUrl = objectUrl;
    } else {
      this.backDesignObjectUrl = objectUrl;
      this.backDesignPreviewUrl = objectUrl;
    }
  }

  private revokeDesignObjectUrl(side: 'front' | 'back'): void {
    const existing = side === 'front' ? this.frontDesignObjectUrl : this.backDesignObjectUrl;
    if (existing) URL.revokeObjectURL(existing);
    if (side === 'front') this.frontDesignObjectUrl = null;
    else this.backDesignObjectUrl = null;
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

  get isTshirt(): boolean {
    return this.currentProduct?.nom.toLowerCase().includes('t-shirt') || false;
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
    if (!this.currentProduct) return;
    
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userDataStr);
      const userId = user.id_user;
      if (!userId) return;

      this.cartService.addToCart(
        userId,
        this.currentProduct.id_produit,
        this.quantity,
        this.unitPrice
      ).subscribe({
        next: () => {
          alert(`${this.currentProduct?.nom} added to cart!`);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          alert('Failed to add to cart.');
        }
      });
    } catch (e) {
      console.error('Error in addToCart:', e);
    }
  }


}
