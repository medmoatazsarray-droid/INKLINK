import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { SearchBar } from '../shared/search-bar/search-bar';

@Component({
  selector: 'app-customizing',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBar, ],
  templateUrl: './customizing.component.html',
  styleUrls: ['./customizing.component.css']
})
export class CustomizingComponent implements OnInit {
  products: Product[] = [];
  imgUrl = 'http://localhost:3001';
  loading = true;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProductsByCategory(12).subscribe({
      next: (prods) => {
        this.products = prods || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load customizing products', err);
        this.products = [];
        this.loading = false;
      }
    });
  }

  customize(product: Product): void {
    this.router.navigate(['/product', product.id_produit]);
  }

  getProductImageSrc(product: Product): string {
    if (!product || !product.image) return 'assets/images/t-shirt white.png';
    // handle images that may already include full url
    if (product.image.startsWith('http') || product.image.startsWith('//')) return product.image;
    return this.imgUrl + product.image;
  }

  trackById(index: number, item: Product) {
    return item.id_produit;
  }

    
}
