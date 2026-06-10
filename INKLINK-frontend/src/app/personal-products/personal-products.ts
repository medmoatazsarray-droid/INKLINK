import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { PromoOfferService } from '../services/promo-offer.service';
import { SearchBar } from '../shared/search-bar/search-bar';

@Component({
  selector: 'app-personal-products',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBar, ],
  templateUrl: './personal-products.html',
  styleUrl: './personal-products.css',
})
export class PersonalProducts implements OnInit {
  products: Product[] = [];
  imgUrl = 'http://localhost:3001';
  loading = true;

  constructor(private productService: ProductService, private router: Router, private promoOfferService: PromoOfferService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (prods) => {
        const all = prods || [];
        // Only show "Personal products" category items.
        this.products = all.filter((p) => (p.categorie_nom || '').toLowerCase().trim() === 'personal products');
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load personal products', err);
        this.products = [];
        this.loading = false;
      },
    });
  }

  openProduct(product: Product): void {
    if (!product?.id_produit) return;

    this.router.navigate(['/detailed-product', product.id_produit], {
      queryParams: { readonly: 1 },
    });
  }

  getProductImageSrc(product: Product): string {
    if (!product || !product.image) return 'assets/images/placeholder.svg';
    if (product.image.startsWith('http') || product.image.startsWith('//') || product.image.startsWith('assets')) {
      return product.image;
    }
    return this.imgUrl + product.image;
  }

  trackById(index: number, item: Product) {
    return item.id_produit;
  }

  openPromoModal(): void {
    this.promoOfferService.openPromoModal();
  }

}
