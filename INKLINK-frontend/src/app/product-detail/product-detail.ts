import { Component, OnDestroy, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { PromoOfferService } from '../services/promo-offer.service';

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
    RouterLink,
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
  dimensions = ['250ml', '350ml', '500ml'];
  posterDimensions = ['400x600 px', '600x900 px', '800x1200 px'];
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

  // Design adjustments
  frontDesignScale = 1;
  frontDesignOffsetX = 0;
  frontDesignOffsetY = 0;
  frontDesignColor = '';

  backDesignScale = 1;
  backDesignOffsetX = 0;
  backDesignOffsetY = 0;
  backDesignColor = '';

  get currentDesignScale(): number { return this.currentView === 'front' ? this.frontDesignScale : this.backDesignScale; }
  set currentDesignScale(val: number) { if (this.currentView === 'front') this.frontDesignScale = val; else this.backDesignScale = val; }

  get currentDesignOffsetX(): number { return this.currentView === 'front' ? this.frontDesignOffsetX : this.backDesignOffsetX; }
  set currentDesignOffsetX(val: number) { if (this.currentView === 'front') this.frontDesignOffsetX = val; else this.backDesignOffsetX = val; }

  get currentDesignOffsetY(): number { return this.currentView === 'front' ? this.frontDesignOffsetY : this.backDesignOffsetY; }
  set currentDesignOffsetY(val: number) { if (this.currentView === 'front') this.frontDesignOffsetY = val; else this.backDesignOffsetY = val; }

  get currentDesignColor(): string { return this.currentView === 'front' ? this.frontDesignColor : this.backDesignColor; }
  set currentDesignColor(val: string) { if (this.currentView === 'front') this.frontDesignColor = val; else this.backDesignColor = val; }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private el: ElementRef,
    private promoOfferService: PromoOfferService
  ) { }

  openPromoModal(): void {
    this.promoOfferService.openPromoModal();
  }

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
        // Set default size/dimension based on product type
        if (this.isMugProduct(data)) {
          this.selectedSize = this.dimensions[0];
        } else if (this.isPosterProduct(data)) {
          this.selectedSize = this.posterDimensions[0];
        } else {
          this.selectedSize = 'M';
        }
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
          // Set default size/dimension based on product type
          if (this.isMugProduct(picked)) {
            this.selectedSize = this.dimensions[0];
          } else if (this.isPosterProduct(picked)) {
            this.selectedSize = this.posterDimensions[0];
          } else {
            this.selectedSize = 'M';
          }
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

  isTshirtProduct(product?: Product): boolean {
    const prod = product || this.product;
    if (!prod) return false;
    const name = (prod.nom || '').toLowerCase();
    return name.includes('t-shirt') || name.includes('tshirt') || name.includes('t shirt') || name.includes('shitrt');
  }

  isTshirt3Product(product?: Product): boolean {
    return this.isTshirtProduct(product) && ((product || this.product)?.nom || '').toLowerCase().includes('3');
  }

  isMugProduct(product?: Product): boolean {
    const prod = product || this.product;
    if (!prod) return false;
    const name = (prod.nom || '').toLowerCase();
    return name.includes('mug');
  }

  /**
   * Detects which mug type (1, 2, or 3) based on product name.
   * Returns 0 if not a recognized mug type.
   */
  getMugType(product?: Product): number {
    const prod = product || this.product;
    if (!prod) return 0;
    const name = (prod.nom || '').toLowerCase();
    if (name.includes('mug 03') || name.includes('mug03') || name.includes('mug 3') || name.includes('mug3') || name.includes('travel mug')) return 3;
    if (name.includes('mug 02') || name.includes('mug02') || name.includes('mug 2') || name.includes('mug2') || name.includes('enamel mug') || name.includes('camp mug')) return 2;
    if (name.includes('mug 01') || name.includes('mug01') || name.includes('mug 1') || name.includes('mug1') || name.includes('classic mug') || name.includes('ceramic mug')) return 1;
    // Default: if it's a mug but no specific type detected, use mug type 1
    if (name.includes('mug')) return 1;
    return 0;
  }

  /**
   * Returns the local fallback image path for a specific mug type.
   */
  getMugFallbackImage(mugType?: number): string {
    const type = mugType || this.getMugType();
    switch (type) {
      case 3: return 'assets/images/mug3.webp';
      case 2: return 'assets/images/mug2.png';
      case 1:
      default: return 'assets/images/mug1.png';
    }
  }

  isHoodieProduct(product?: Product): boolean {
    const prod = product || this.product;
    if (!prod) return false;
    const name = (prod.nom || '').toLowerCase();
    return name.includes('hoodie');
  }

  getHoodieType(product?: Product): string {
    const prod = product || this.product;
    if (!prod) return '';
    const name = (prod.nom || '').toLowerCase();
    if (name.includes('hoodie 3') || name.includes('hoodie3')) return '3';
    if (name.includes('hoodie 2') || name.includes('hoodie2')) return '2';
    if (name.includes('hoodie black') || name.includes('black hoodie')) return 'black';
    return '';
  }

  getHoodieFallbackImage(hoodieType?: string): string {
    const type = hoodieType || this.getHoodieType();
    switch (type) {
      case '3': return 'assets/images/hoodie3.png';
      case '2': return 'assets/images/hoodie2.png';
      case 'black': return 'assets/images/hoodie.png';
      default: return 'assets/images/hoodie.png';
    }
  }

  getHoodieBackImage(hoodieType?: string): string {
    const type = hoodieType || this.getHoodieType();
    switch (type) {
      case '3': return 'assets/images/hoodie 3 back.png';
      case '2': return 'assets/images/hoodie  2 back.png';
      case 'black': return 'assets/images/hoodie 1 back.png';
      default: return 'assets/images/hoodie 1 back.png';
    }
  }

  isPosterProduct(product?: Product): boolean {
    const prod = product || this.product;
    if (!prod) return false;
    const name = (prod.nom || '').toLowerCase();
    return name.includes('poster') || name.includes('affiche');
  }

  getPosterFallbackImage(): string {
    return 'assets/images/poster1.png';
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
    // For mug products, use local mug images for perfect mask alignment
    if (this.isMugProduct()) {
      if (this.product?.image) return this.imgUrl + this.product.image;
      return this.getMugFallbackImage();
    }
    
    // For hoodie products
    if (this.isHoodieProduct()) {
      if (this.currentView === 'back') {
        return this.getHoodieBackImage();
      }
      if (this.product?.image) return this.imgUrl + this.product.image;
      return this.getHoodieFallbackImage();
    }

    // For poster products
    if (this.isPosterProduct()) {
      if (this.product?.image) return this.imgUrl + this.product.image;
      return this.getPosterFallbackImage();
    }

    if (this.currentView === 'back') {
      if (this.isTshirt3Product()) {
        return 'assets/images/shirt 1 back.png';
      }
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
    // Use the actual product image as the mask for mugs, hoodies, posters, and specific t-shirts
    // The alpha channel of the PNG/WebP creates a pixel-perfect silhouette
    if (this.isMugProduct() || this.isHoodieProduct() || this.isPosterProduct() || this.isTshirt3Product()) {
      return `url("${this.getProductImageSrc()}")`;
    }
    // Default: t-shirt mask
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
      'XXL': 'scale(1.15)',
      '250ml': 'scale(0.9)',
      '350ml': 'scale(1)',
      '500ml': 'scale(1.1)',
      '400x600 px' : 'scale(0.95)',
      '600x900 px' : 'scale(0.95)',
      '800x1200 px' : 'scale(1)'
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
    
    // Reset adjustments
    if (side === 'front') {
      this.frontDesignScale = 1;
      this.frontDesignOffsetX = 0;
      this.frontDesignOffsetY = 0;
      this.frontDesignColor = '';
    } else {
      this.backDesignScale = 1;
      this.backDesignOffsetX = 0;
      this.backDesignOffsetY = 0;
      this.backDesignColor = '';
    }
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

  artistTemplates = [
    'assets/images/logo 1.png',
    'assets/images/logo 2.png',
    'assets/images/logo 3.png',
    'assets/images/logo 4.png',
    'assets/images/logo 5.png'
  ];

  selectArtistTemplate(side: 'front' | 'back', logoUrl: string): void {
    if (side === 'front') {
      this.frontDesignPreviewUrl = logoUrl;
      this.frontDesignFile = undefined;
      this.frontDesignScale = 1;
      this.frontDesignOffsetX = 0;
      this.frontDesignOffsetY = 0;
      this.frontDesignColor = '';
      if (this.frontDesignObjectUrl) {
         URL.revokeObjectURL(this.frontDesignObjectUrl);
         this.frontDesignObjectUrl = null;
      }
    } else {
      this.backDesignPreviewUrl = logoUrl;
      this.backDesignFile = undefined;
      this.backDesignScale = 1;
      this.backDesignOffsetX = 0;
      this.backDesignOffsetY = 0;
      this.backDesignColor = '';
      if (this.backDesignObjectUrl) {
         URL.revokeObjectURL(this.backDesignObjectUrl);
         this.backDesignObjectUrl = null;
      }
    }
  }

  clearDesign(side: 'front' | 'back'): void {
    if (side === 'front') {
      this.frontDesignFile = undefined;
      this.frontDesignPreviewUrl = null;
      this.frontDesignScale = 1;
      this.frontDesignOffsetX = 0;
      this.frontDesignOffsetY = 0;
      this.frontDesignColor = '';
      this.revokeDesignObjectUrl('front');
    } else {
      this.backDesignFile = undefined;
      this.backDesignPreviewUrl = null;
      this.backDesignScale = 1;
      this.backDesignOffsetX = 0;
      this.backDesignOffsetY = 0;
      this.backDesignColor = '';
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
      id: this.product.id_produit,
      name: this.product.nom,
      price: this.product.prixBase,
      image: this.product.image,
      color: selectedColorObj?.hex || '',
      colorName: selectedColorObj?.name || '',
      size: this.selectedSize,
      quantity: this.quantity,
      printing: this.selectedSide,
      frontDesign: this.frontDesignPreviewUrl,
      backDesign: this.backDesignPreviewUrl,
      frontDesignScale: this.frontDesignScale,
      frontDesignOffsetX: this.frontDesignOffsetX,
      frontDesignOffsetY: this.frontDesignOffsetY,
      backDesignScale: this.backDesignScale,
      backDesignOffsetX: this.backDesignOffsetX,
      backDesignOffsetY: this.backDesignOffsetY,
      frontDesignColor: this.frontDesignColor,
      backDesignColor: this.backDesignColor,
      isMug: this.isMugProduct(),
      productPreviewUrl: this.getProductImageSrc(),
      maskImageCss: this.getMaskImageCss()
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

  getInkTransform(side: 'front' | 'back'): string {
    const scale = side === 'front' ? this.frontDesignScale : this.backDesignScale;
    const x = side === 'front' ? this.frontDesignOffsetX : this.backDesignOffsetX;
    const y = side === 'front' ? this.frontDesignOffsetY : this.backDesignOffsetY;
    return `translate(${x}px, ${y}px) scale(${scale})`;
  }

  hasDesignForCurrentView(): boolean {
    if (this.currentView === 'front') return !!this.frontDesignPreviewUrl;
    return !!this.backDesignPreviewUrl;
  }

  navigateToProduct(product: Product): void {
    if (product && product.id_produit) {
      this.router.navigate(['/detailed-product', product.id_produit], { queryParams: { readonly: '1' } });
    }
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
