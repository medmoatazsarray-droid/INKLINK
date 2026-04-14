import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';

import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';

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
    PartnersComponent
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  imgUrl = 'http://localhost:3001';

  productTagline = 'Printed in Tunis with vegetable-based inks';
  private fallbackImageSrc = 'assets/images/t-shirt 1.png';

  // Configuration options
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  colors: ColorOption[] = [
    { value: 'black', hex: '#000000', name: 'Black' },
    { value: 'blue', hex: '#0000FF', name: 'Blue' },
    { value: 'magenta', hex: '#FF00FF', name: 'Magenta' },
    { value: 'red', hex: '#FF0000', name: 'Red' },
    { value: 'orange', hex: '#FFA500', name: 'Orange' },
    { value: 'lightgray', hex: '#D3D3D3', name: 'Light Gray' }
  ];

  // Selected values
  selectedSize = 'M';
  selectedColor = 'black';
  selectedSide = 'front';
  customisationFront = 'upload';
  customisationBack = 'upload';
  quantity = 1;

  // Related products
  cutomisedProducts: Product[] = [];
  similarProducts: Product[] = [];

  // Carousel state
  customisedIndex = 0;
  similarIndex = 0;
  visibleCount = 4;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
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
  }

  increaseQty(): void {
    this.quantity++;
  }

  decraseQty(): void {
    if (this.quantity > 1) {
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
    if (this.product?.image) return this.imgUrl + this.product.image;

    if (this.selectedSide === 'back' || this.selectedSide === 'both') {
      return 'assets/images/tshirt-front-back.png';
    }

    return this.fallbackImageSrc;
  }

  getSelectedColorHex(): string {
    const found = this.colors.find(c => c.value === this.selectedColor);
    return found?.hex || '#000000';
  }

  shouldUseTintOverlay(): boolean {
    return !this.product?.image;
  }

  getMaskImageCss(): string {
    return 'url("assets/images/t-shirt 1.png")';
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

    if (this.selectedColor === 'black') {
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

  addToCart(): void {
    if (!this.product) return;

    const cartItem = {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
      printSide: this.selectedSide,
      customization: {
        front: this.customisationFront,
        back: this.customisationBack
      }
    };

    console.log('Added to cart:', cartItem);
  }
}
