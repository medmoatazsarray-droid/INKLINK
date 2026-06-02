import { Component, OnDestroy, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

import { SearchBar } from '../shared/search-bar/search-bar';
import { NavbarCom } from '../shared/navbar-com/navbar-com';

interface ColorOption {
  value: string;
  hex: string;
  name: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBar,
    
    NavbarCom
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit, OnDestroy, AfterViewInit {
  product: Product | null = null;
  imgUrl = 'http://localhost:3001';
  private revealObserver: IntersectionObserver | null = null;

  productTagline = 'Printed in Tunis with vegetable-based inks';
  private fallbackImageSrc = 'assets/images/t0.png';

  // Configuration options
  sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  colors: ColorOption[] = [
    { value: 'black', hex: '#000000', name: 'Black' },
    { value: 'white', hex: '#FFFFFF', name: 'White' },
    { value: 'blue', hex: '#000BD4', name: 'Blue' },
    { value: 'magenta', hex: '#FC00A8', name: 'Magenta' },
    { value: 'red', hex: '#FF0000', name: 'Red' },
    { value: 'orange', hex: '#FF9500', name: 'Orange' },
    { value: 'lightgray', hex: '#CCD7DD', name: 'Light Gray' },

  ];

  // Selected values
  selectedSize = 'M';
  selectedColor = '';
  selectedSide: 'front' | 'back' | 'both' = 'front';
  currentView: 'front' | 'back' = 'front';
  customisationFront = 'upload';
  customisationBack = 'upload';
  quantity = 0;
  frontDesignFile?: File;
  backDesignFile?: File;
  frontDesignPreviewUrl: string | null = null;
  backDesignPreviewUrl: string | null = null;
  private frontDesignObjectUrl: string | null = null;
  private backDesignObjectUrl: string | null = null;

  // Related products
  cutomisedProducts: Product[] = [];
  similarProducts: Product[] = [];

  // Carousel state
  customisedIndex = 0;
  similarIndex = 0;
  visibleCount = 4;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productIdParam = params['id'];
      if (productIdParam != null) {
        const productId = Number(productIdParam);
        if (Number.isFinite(productId)) {
          this.loadProductById(productId);
          return;
        }
      }

      this.loadOutfitProduct();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initRevealAnimation(), 50);
  }

  ngOnDestroy(): void {
    this.revokeDesignObjectUrl('front');
    this.revokeDesignObjectUrl('back');
    if (this.revealObserver) {
      this.revealObserver.disconnect();
    }
  }

  private initRevealAnimation(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1
    });

    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((el: HTMLElement) => observer.observe(el));
    this.revealObserver = observer;
  }

  private loadProductById(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loadRelatedProductsForCategory(data.id_categorie);
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  private loadOutfitProduct(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        const exactTshirt = data.find(p => (p.nom || '').toLowerCase().trim() === 't-shirt');
        const anyTshirt = data.find(p => this.isTshirtProduct(p));
        const picked = exactTshirt ?? anyTshirt ?? data[0] ?? null;

        if (picked) {
          this.product = picked;
          this.loadRelatedProductsForCategory(picked.id_categorie);
        } else {
          console.warn('No products found in database, using fallback defaults');
        }
      },
      error: (error) => {
        console.error('Error loading products for Outfit page:', error);
      }
    });
  }

  private loadRelatedProductsForCategory(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data) => {
        this.cutomisedProducts = data.slice(0, 8);
        this.similarProducts = data.slice(0, 8);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
        this.cutomisedProducts = [];
        this.similarProducts = [];
      }
    });
  }

  private isTshirtProduct(product: Product): boolean {
    const name = (product.nom || '').toLowerCase();
    return name.includes('t-shirt') || name.includes('tshirt') || name.includes('t shirt');
  }

  get visibleCustomised(): Product[] {
    return this.cutomisedProducts.slice(
      this.customisedIndex,
      this.customisedIndex + this.visibleCount
    );
  }

  get visibleSimilar(): Product[] {
    return this.similarProducts.slice(
      this.similarIndex,
      this.similarIndex + this.visibleCount
    );
  }

  onSideChange(): void {
    if (this.selectedSide === 'front' || this.selectedSide === 'back') {
      this.currentView = this.selectedSide;
    } else {
      this.currentView = 'front';
    }
  }

  increaseQty(): void {
    if (this.quantity < 100) {
      this.quantity++;
    }
  }

  decraseQty(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  prevCustomised(): void {
    if (this.customisedIndex > 0) {
      this.customisedIndex--;
    }
  }

  nextCustomised(): void {
    if (this.customisedIndex + this.visibleCount < this.cutomisedProducts.length) {
      this.customisedIndex++;
    }
  }

  prevSimilar(): void {
    if (this.similarIndex > 0) {
      this.similarIndex--;
    }
  }

  nextSimilar(): void {
    if (this.similarIndex + this.visibleCount < this.similarProducts.length) {
      this.similarIndex++;
    }
  }

  onSearch(query: string): void {
  }

  getProductImageSrc(): string {
    if (this.currentView === 'back') {
      return 'assets/images/t0-back.png';
    }

    if (this.isOutfitRoute()) return this.fallbackImageSrc;

    if (this.product?.image) return this.imgUrl + this.product.image;

    return this.fallbackImageSrc;
  }

  private isOutfitRoute(): boolean {
    return this.route.snapshot.routeConfig?.path === 'outfit';
  }

  getSelectedColorHex(): string {
    const found = this.colors.find(c => c.value === this.selectedColor);
    return found?.hex || '#000000';
  }

  shouldUseTintOverlay(): boolean {
    return this.selectedColor !== '';
  }

  getMaskImageCss(): string {
    const img = (this.currentView === 'back') ? 't0-back.png' : 't0.png';
    return `url("assets/images/${img}")`;
  }

  getImageScale(): string {
    const scales: Record<string, string> = {
      'XS': 'scale(0.85)',
      'S': 'scale(0.9)',
      'M': 'scale(1)',
      'L': 'scale(1.05)',
      'XL': 'scale(1.1)',
      'XXL': 'scale(1.15)'
    };
    return scales[this.selectedSize] || 'scale(1)';
  }

  getProductImageStyle(): { filter?: string } {
    if (this.shouldUseTintOverlay()) return {};

    if (this.selectedColor === 'black' || this.selectedColor === '') {
      return {};
    }

    const colorFilters: { [key: string]: string } = {
      blue: 'hue-rotate(240deg) saturate(1.2)',
      magenta: 'hue-rotate(290deg) saturate(1.2)',
      red: 'hue-rotate(0deg) saturate(1.2)',
      orange: 'hue-rotate(30deg) saturate(1.2)',
      lightgray: 'brightness(1.2) saturate(0.1)',
    };
    return { filter: colorFilters[this.selectedColor] || '' };
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

  addToCart(): void {
    if (!this.product) return;
    if (this.quantity <= 0) {
      alert('Please select a quantity greater than 0');
      return;
    }

    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    const selectedColorObj = this.colors.find(c => c.value === this.selectedColor);
    const pendingOrder = {
      name: this.product.nom,
      price: this.product.prixBase,
      image: this.product.image,
      color: selectedColorObj?.hex || '',
      colorName: selectedColorObj?.name || '',
      size: this.selectedSize,
      quantity: this.quantity,
      printing: this.selectedSide,
      frontDesign: this.frontDesignPreviewUrl,
      backDesign: this.backDesignPreviewUrl
    };
    localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    this.router.navigate(['/order-payment']);

    try {
      const user = JSON.parse(userDataStr);
      const userId = user.id_user;

      if (!userId) return;

      this.cartService.addToCart(
        userId,
        this.product.id_produit,
        this.quantity,
        this.product.prixBase
      ).subscribe({
        next: (res) => {
          console.log('Added to cart:', res);
          alert(`${this.product?.nom} added to cart!`);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          alert('Failed to add product to cart. Please try again.');
        }
      });
    } catch (e) {
      console.error('Error in addToCart:', e);
    }
  }

  getTotalPrice(): number {
    if (!this.product || !this.product.prixBase) return 0;
    return this.product.prixBase * this.quantity;
  }

  saveProduct(product: any, event: Event): void {
    event.stopPropagation();

    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) {
      alert('Please log in to save designs.');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userDataStr);
      const userId = user.id_user;

      if (!userId) return;

      const storageKey = `savedDesigns_${userId}`;
      const savedStr = localStorage.getItem(storageKey);
      let savedItems: any[] = [];

      if (savedStr) {
        savedItems = JSON.parse(savedStr);
      }

      // Check if already saved based on name to avoid duplicates
      const exists = savedItems.find(item => item.nom === (product.nom || product.name));

      if (!exists) {
        // Save using the structure expected by the profile page
        savedItems.push({
          nom: product.nom || product.name,
          image: product.image,
          prixBase: product.prixBase || product.price
        });
        localStorage.setItem(storageKey, JSON.stringify(savedItems));
        alert('Product saved to your profile!');
      } else {
        alert('Product is already saved in your profile.');
      }
    } catch (e) {
      console.error('Error saving product', e);
    }
  }

    
}
