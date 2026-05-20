import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';
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
    PartnersComponent,
    NavbarCom
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit, OnDestroy {
  product: Product | null = null;
  imgUrl = 'http://localhost:3001';

  productTagline = 'Printed in Tunis with vegetable-based inks';
  private fallbackImageSrc = 'assets/images/t0.png';

  private tshirtMaskFront: string | null = null;
  private tshirtMaskBack: string | null = null;
  private tshirtMaskPromise: Promise<void> | null = null;

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ensureTshirtMasks();
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

  ngOnDestroy(): void {
    this.revokeDesignObjectUrl('front');
    this.revokeDesignObjectUrl('back');
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

  isTshirtProduct(product: Product | null): boolean {
    if (!product) return false;
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
    if (this.isTshirtProduct(this.product)) {
      return this.currentView === 'back' ? 'assets/images/t0-back.png' : 'assets/images/t0.png';
    }

    if (this.currentView === 'back') {
      return 'assets/images/t0-back.png';
    }

    if (this.product?.image) return this.imgUrl + this.product.image;

    return this.fallbackImageSrc;
  }

  getSelectedColorHex(): string {
    const found = this.colors.find(c => c.value === this.selectedColor);
    return found?.hex || '#000000';
  }

  shouldUseTintOverlay(): boolean {
    return this.selectedColor !== '';
  }

  getMaskImageCss(): string {
    // Generate an alpha mask from the mockup image to avoid tinting the white background.
    // Falls back to the raw mockup image if generation isn't ready yet.
    this.ensureTshirtMasks();
    const dataUrl = (this.currentView === 'back') ? this.tshirtMaskBack : this.tshirtMaskFront;
    if (dataUrl) return `url("${dataUrl}")`;

    const img = (this.currentView === 'back') ? 't0-back.png' : 't0.png';
    return `url("assets/images/${img}")`;
  }

  private ensureTshirtMasks(): void {
    if (this.tshirtMaskPromise) return;
    this.tshirtMaskPromise = (async () => {
      const [front, back] = await Promise.all([
        this.generateAlphaMaskDataUrl('assets/images/t0.png'),
        this.generateAlphaMaskDataUrl('assets/images/t0-back.png'),
      ]);
      this.tshirtMaskFront = front;
      this.tshirtMaskBack = back;
    })();
  }

  private generateAlphaMaskDataUrl(src: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const maxDim = 900;
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          const scale = Math.min(1, maxDim / Math.max(w, h));
          w = Math.max(1, Math.floor(w * scale));
          h = Math.max(1, Math.floor(h * scale));

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          const mask = document.createElement('canvas');
          mask.width = w;
          mask.height = h;
          const mctx = mask.getContext('2d');
          if (!mctx) return resolve(null);
          const maskImg = mctx.createImageData(w, h);

          const minAlpha = 20;
          const wH = w * h;

          // 1) Detect "white-ish background" via flood-fill from the borders.
          // This avoids capturing anti-aliased halos around the shirt.
          const isBg = (i: number): boolean => {
            const a = data[i + 3];
            if (a <= minAlpha) return true;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = (r + g + b) / 3;
            const maxc = Math.max(r, g, b);
            const minc = Math.min(r, g, b);
            const chroma = maxc - minc;
            return lum >= 245 && chroma <= 18;
          };

          const bg = new Uint8ClampedArray(wH);
          const q = new Int32Array(wH);
          let qs = 0, qe = 0;
          const push = (idx: number) => { bg[idx] = 1; q[qe++] = idx; };

          // Seed queue with border pixels classified as background
          for (let x = 0; x < w; x++) {
            let idx = x;
            if (!bg[idx] && isBg(idx * 4)) push(idx);
            idx = (h - 1) * w + x;
            if (!bg[idx] && isBg(idx * 4)) push(idx);
          }
          for (let y = 0; y < h; y++) {
            let idx = y * w;
            if (!bg[idx] && isBg(idx * 4)) push(idx);
            idx = y * w + (w - 1);
            if (!bg[idx] && isBg(idx * 4)) push(idx);
          }

          while (qs < qe) {
            const idx = q[qs++];
            const x = idx % w;
            const y = (idx / w) | 0;
            // 4-neighbors
            if (x > 0) {
              const ni = idx - 1;
              if (!bg[ni] && isBg(ni * 4)) push(ni);
            }
            if (x < w - 1) {
              const ni = idx + 1;
              if (!bg[ni] && isBg(ni * 4)) push(ni);
            }
            if (y > 0) {
              const ni = idx - w;
              if (!bg[ni] && isBg(ni * 4)) push(ni);
            }
            if (y < h - 1) {
              const ni = idx + w;
              if (!bg[ni] && isBg(ni * 4)) push(ni);
            }
          }

          // 2) Foreground is non-background. Exclude very dark pixels (hanger/pole).
          const alpha = new Uint8ClampedArray(wH);
          for (let p = 0, i = 0; p < wH; p++, i += 4) {
            if (bg[p]) continue;
            const a = data[i + 3];
            if (a <= minAlpha) continue;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = (r + g + b) / 3;
            if (lum <= 45) continue; // drop near-black hanger
            alpha[p] = 1;
          }

          const neighbors = [-1 - w, -w, 1 - w, -1, 1, -1 + w, w, 1 + w];
          const iters = 0;
          for (let it = 0; it < iters; it++) {
            const next = new Uint8ClampedArray(wH);
            for (let y = 1; y < h - 1; y++) {
              for (let x = 1; x < w - 1; x++) {
                const idx = y * w + x;
                if (!alpha[idx]) continue;
                let all = 1;
                for (let n = 0; n < neighbors.length; n++) {
                  if (!alpha[idx + neighbors[n]]) { all = 0; break; }
                }
                next[idx] = all ? 1 : 0;
              }
            }
            for (let i = 0; i < wH; i++) alpha[i] = next[i];
          }

          for (let p = 0, i = 0; p < wH; p++, i += 4) {
            const a = alpha[p] ? 255 : 0;
            maskImg.data[i] = 0;
            maskImg.data[i + 1] = 0;
            maskImg.data[i + 2] = 0;
            maskImg.data[i + 3] = a;
          }
          mctx.putImageData(maskImg, 0, 0);
          resolve(mask.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
      if (img.complete) img.onload?.(new Event('load') as any);
    });
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

  async addToCart(): Promise<void> {
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

    // Build customization data for order-payment page
    const colorObj = this.colors.find(c => c.value === this.selectedColor);
    const orderData: any = {
      name: this.product.nom,
      price: this.product.prixBase,
      image: this.product.image
        ? (this.product.image.startsWith('/uploads') ? this.imgUrl + this.product.image : this.product.image)
        : 'assets/images/t0.png',
      color: colorObj?.hex || '#000000',
      colorName: colorObj?.name || 'Black',
      size: this.selectedSize,
      quantity: this.quantity,
      printing: this.selectedSide
    };

    // Convert uploaded designs to base64 for persistence
    if (this.frontDesignFile) {
      orderData.frontDesign = await this.fileToBase64(this.frontDesignFile);
    }
    if (this.backDesignFile) {
      orderData.backDesign = await this.fileToBase64(this.backDesignFile);
    }

    localStorage.setItem('pendingOrder', JSON.stringify(orderData));

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
          this.router.navigate(['/order-payment']);
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

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
