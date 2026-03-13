import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';

type ProduitApi = {
  id_produit: number;
  nom: string;
  description: string | null;
  prixBase: number;
  stock: number;
  id_categorie: number | null;
  id_artiste: number | null;
  statutProduction: 'EN_COURS' | 'TERMINE' | 'ANNULE' | string;
  image: string | null;
};

@Component({
  selector: 'app-ajouter-produit',
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './ajouter-produit.html',
  styleUrl: './ajouter-produit.css',
})
export class AjouterProduit implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  adminName: string = '';
  currentDate: string = '';

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  successMessage: string = '';
  errorMessage: string = '';

  categories: any[] = [];
  artistes: any[] = [];

  isEditMode = false;
  editingProductId: number | null = null;

  produit = {
    nom: '',
    description: '',
    prixBase: null as number | null,
    stock: null as number | null,
    id_categorie: '',
    id_artiste: '',
    statutProduction: 'IN_PROGRESS',
    template: 'non',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.loadCategories();
    this.loadArtistes();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (Number.isInteger(parsed)) {
        this.isEditMode = true;
        this.editingProductId = parsed;
        this.loadProduitForEdit(parsed);
      }
    }
  }

  loadCategories(): void {
    this.http
      .get<any[]>(`${environment.BACKEND_ENDPOINT}/api/categories`)
      .subscribe((data) => (this.categories = data || []));
  }

  loadArtistes(): void {
    this.http
      .get<any[]>(`${environment.BACKEND_ENDPOINT}/api/artistes`)
      .subscribe((data) => (this.artistes = data || []));
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private mapDbStatusToUi(value: string): string {
    const v = String(value || '').toUpperCase();
    if (v === 'EN_COURS') return 'IN_PROGRESS';
    if (v === 'TERMINE') return 'COMPLETED';
    if (v === 'ANNULE') return 'CANCELED';
    return 'IN_PROGRESS';
  }

  loadProduitForEdit(id: number): void {
    this.http.get<ProduitApi>(`${environment.BACKEND_ENDPOINT}/api/produits/${id}`).subscribe({
      next: (p) => {
        this.produit = {
          ...this.produit,
          nom: p?.nom ?? '',
          description: p?.description ?? '',
          prixBase: p?.prixBase ?? null,
          stock: p?.stock ?? null,
          id_categorie: p?.id_categorie ? String(p.id_categorie) : '',
          id_artiste: p?.id_artiste ? String(p.id_artiste) : '',
          statutProduction: this.mapDbStatusToUi(p?.statutProduction),
        };

        const image = p?.image ? String(p.image) : '';
        if (image) this.imagePreview = `${environment.BACKEND_ENDPOINT}${image}`;
      },  
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Impossible de charger le produit.';
      },
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedFile && !this.isEditMode) {
      this.errorMessage = 'Veuillez ajouter une image';
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.produit.nom);
    formData.append('description', this.produit.description);
    formData.append('prixBase', String(this.produit.prixBase));
    formData.append('stock', String(this.produit.stock));
    formData.append('id_categorie', this.produit.id_categorie);
    formData.append('id_artiste', this.produit.id_artiste);
    formData.append('statutProduction', this.produit.statutProduction);
    formData.append('template', this.produit.template);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    const req$ =
      this.isEditMode && this.editingProductId
        ? this.http.put(`${environment.BACKEND_ENDPOINT}/api/produits/${this.editingProductId}`, formData)
        : this.http.post(`${environment.BACKEND_ENDPOINT}/api/produits`, formData);

    req$.subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Produit modifié avec succès'
          : 'Produit ajouté avec succès';

        if (this.isEditMode && this.editingProductId) {
          // refresh image preview if the user uploaded a new one
          if (this.selectedFile) {
            this.selectedFile = null;
            this.loadProduitForEdit(this.editingProductId);
          }
          return;
        }

        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors de l’enregistrement du produit.';
        console.error(err);
      },
    });
  }

  resetForm(): void {
    this.produit = {
      nom: '',
      description: '',
      prixBase: null,
      stock: null,
      id_categorie: '',
      id_artiste: '',
      statutProduction: 'IN_PROGRESS',
      template: 'non',
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onCancel(): void {
    this.router.navigate([this.isEditMode ? '/gestion-produits' : '/dashboard']);
  }
}

