import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PartnersComponent } from '../shared/partners/partners';
import { SearchBar } from '../shared/search-bar/search-bar';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, RouterLink, PartnersComponent, SearchBar],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage implements OnInit {
  apiUrl: string = environment.BACKEND_ENDPOINT;
  imgUrl: string = environment.IMG_URL;

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

  culturalItems = [
    { title: 'Restaurant Kit', price: '300.00', image: 'assets/images/cult0.png' },
    { title: 'Festival Kit', price: '450.00', image: 'assets/images/cult1.png' },
    { title: 'Startup Identity', price: '550.00', image: 'assets/images/cult2.png' }
  ];

  allProducts: Product[] = [];
  mostRequested: Product[] = [];
  customizedByClients: Product[] = [];
  madeByArtists: Product[] = [];

  constructor(private http: HttpClient) { }

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

        this.mostRequested = this.allProducts.filter(p =>
          p.categorie_nom === 'Most requested this week'
        );
        this.customizedByClients = this.allProducts.filter(p =>
          p.categorie_nom === 'Customised by clients'
        );
        this.madeByArtists = this.allProducts.filter(p =>
          p.categorie_nom === 'Made by artists'
        );

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
  }

  setCultural(index: number): void {
    this.culturalActive = index;
  }
}
