import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';

type Category = { id_categorie: number; nom: string };
type Artiste = { id_artiste: number; nom: string };
type Product = {
  id_produit: number;
  nom: string;
  description: string | null;
  prixBase: number;
  stock: number;
  id_categorie: number | null;
  id_artiste: number | null;
  image: string | null;
  categorie_nom?: string | null;
  artiste_nom?: string | null;
};

@Component({
  selector: 'app-gestion-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './gestion-produits.html',
  styleUrl: './gestion-produits.css',
})
export class GestionProduits implements OnInit {
  adminName = '';
  currentDate = '';

  isLoading = false;
  errorMessage = '';

  products: Product[] = [];
  categories: Category[] = [];
  artistes: Artiste[] = [];

  searchTerm = '';
  selectedCategorie = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.loadCategories();
    this.loadArtistes();
    this.loadProducts();
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${environment.BACKEND_ENDPOINT}/categorie`).subscribe({
      next: (data) => (this.categories = data || []),
      error: () => {
        this.categories = [];
      },
    });
  }

  loadArtistes(): void {
    this.http.get<Artiste[]>(`${environment.BACKEND_ENDPOINT}/artiste`).subscribe({
      next: (data) => (this.artistes = data || []),
      error: () => {
        this.artistes = [];
      },
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    let params = new HttpParams();
    if (this.searchTerm.trim()) params = params.set('q', this.searchTerm.trim());
    if (this.selectedCategorie) params = params.set('categorie', this.selectedCategorie);

    this.http
      .get<Product[]>(`${environment.BACKEND_ENDPOINT}/produit/search`, { params })
      .subscribe({
        next: (data) => {
          this.products = data || [];
          this.isLoading = false;
        },
        error: (err) => {
          this.products = [];
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Erreur lors du chargement des produits.';
        },
      });
  }

  onFiltersChange(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategorie = '';
    this.loadProducts();
  }

  openEdit(product: Product): void {
    this.router.navigate(['/ajouter-produit', product.id_produit]);
  }

  deleteProduct(product: Product): void {
    const ok = window.confirm(`Supprimer le produit "${product.nom}" ?`);
    if (!ok) return;

    this.http.delete(`${environment.BACKEND_ENDPOINT}/produit/${product.id_produit}`).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors de la suppression du produit.';
      },
    });
  }

  productCategorieName(product: Product): string {
    return (
      product.categorie_nom ||
      this.categories.find((c) => c.id_categorie === product.id_categorie)?.nom ||
      '—'
    );
  }

  productArtisteName(product: Product): string {
    return (
      product.artiste_nom ||
      this.artistes.find((a) => a.id_artiste === product.id_artiste)?.nom ||
      '—'
    );
  }
}
