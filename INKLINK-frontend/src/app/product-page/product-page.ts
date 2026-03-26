import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Footer } from '../shared/footer/footer';
import { PartnersComponent } from '../shared/partners/partners';

interface Product {
  id_produit?: number;
  nom: string;
  prixBase: number;
  image?: string;
  badge?: string;
  categorie_nom?: string;
}

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, PartnersComponent],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage implements OnInit {
  apiUrl: string = environment.BACKEND_ENDPOINT;
  imgUrl: string = environment.IMG_URL;

  searchQuery: string = '';
  activeFilter: string = 'Promote an event';
  culturalActive: number = 1;
  filters: string[] = [
    'Promote an event',
    'Launching a brand',
    'Social media content',
    'Merchandise marketing',
    'Business cards & stationery',
    'Posters & event materials',
    'Goodies'
  ];

  allProducts: Product[] = [];
  mostRequested: Product[] = [];
  customizedByClients: Product[] = [];
  madeByArtists: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>(`${this.apiUrl}/produit/search`).subscribe({
      next: (data) => {
        this.allProducts = data.reverse().map(p => ({
          ...p,
          nom: p.nom,
          prixBase: p.prixBase,
          image: p.image,
          badge: p.id_produit % 4 === 0 ? '100 pièce' : (p.id_produit % 7 === 0 ? 'Best Seller' : null)
        }));
        
        // Filter by the exact category names from your database
        this.mostRequested = this.allProducts.filter(p => 
          p.categorie_nom === 'Most requested this week'
        );
        this.customizedByClients = this.allProducts.filter(p => 
          p.categorie_nom === 'Customised by clients'
        );
        this.madeByArtists = this.allProducts.filter(p => 
          p.categorie_nom === 'Made by artists'
        );
        
        // Fallbacks: if a category has no products in the DB, show slices to keep the page design populated
        if (this.allProducts.length > 0) {
          if (this.mostRequested.length === 0) this.mostRequested = this.allProducts.slice(0, 6);
          if (this.customizedByClients.length === 0) this.customizedByClients = this.allProducts.slice(3, 9);
          if (this.madeByArtists.length === 0) this.madeByArtists = this.allProducts.slice(2, 8);
        }
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    // Optional: add logic here to filter allProducts based on activeFilter
  }

  setCultural(index: number): void {
    this.culturalActive = index;
  }
}
