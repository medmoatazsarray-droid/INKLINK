import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ArtistForm {
  nom: string;
  location: string;
  bio: string;
  email: string;
  telephone: string;
  image: string | null;
  skills: string;
  type_artiste: string;
  statut: string;
}

@Component({
  selector: 'app-ajouter-artiste',
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './ajouter-artiste.html',
  styleUrl: './ajouter-artiste.css',
})
export class AjouterArtiste implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  adminName: string = 'Admin';
  currentDate: string = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  searchQuery: string = '';
  previewImage: string | null = null;
  isSaving: boolean = false;
  isEditMode: boolean = false;
  editingArtistId: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  artist: ArtistForm = {
    nom: '',
    location: '',
    bio: '',
    email: '',
    telephone: '',
    image: null,
    skills: '',
    type_artiste: '',
    statut: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (Number.isInteger(parsed)) {
        this.isEditMode = true;
        this.editingArtistId = parsed;
        this.loadArtisteForEdit(parsed);
      }
    }
  }

  loadArtisteForEdit(id: number): void {
    this.http.get<any>(`${environment.BACKEND_ENDPOINT}/artiste/${id}`).subscribe({
      next: (art) => {
        this.artist = {
          nom: art.nom || '',
          location: art.location || '',
          bio: art.bio || '',
          email: art.email || '',
          telephone: art.telephone || '',
          image: art.image || null,
          skills: art.skills || '',
          type_artiste: art.type_artiste || '',
          statut: art.statut || '',
        };
        if (art.image) {
          this.previewImage =
            art.image.startsWith('http') || art.image.startsWith('data:')
              ? art.image
              : `${environment.IMG_URL}${art.image}`;
        }
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Impossible de charger les données de l'artiste.";
      },
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.artist.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (
      !this.artist.nom ||
      !this.artist.email ||
      !this.artist.telephone ||
      !this.artist.type_artiste ||
      !this.artist.statut
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.isSaving = true;

    if (this.isEditMode && this.editingArtistId !== null) {
      this.http
        .put(
          `${environment.BACKEND_ENDPOINT}/artiste/${this.editingArtistId}`,
          this.artist
        )
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = "L'artiste a été modifié avec succès.";
            setTimeout(() => this.router.navigate(['/gestion-artistes']), 1500);
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMessage =
              err?.error?.message ||
              "Une erreur est survenue lors de la modification de l'artiste.";
            console.error(err);
          },
        });
    } else {
      this.http
        .post(`${environment.BACKEND_ENDPOINT}/artiste`, this.artist)
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.successMessage = "L'artiste a été ajouté avec succès.";
            this.resetForm();
          },
          error: (err) => {
            this.isSaving = false;
            this.errorMessage =
              err?.error?.message || "Une erreur est survenue lors de l'ajout de l'artiste.";
            console.error(err);
          },
        });
    }
  }

  resetForm(): void {
    this.artist = {
      nom: '',
      location: '',
      bio: '',
      email: '',
      telephone: '',
      image: null,
      skills: '',
      type_artiste: '',
      statut: '',
    };
    this.previewImage = null;
  }

  onCancel(): void {
    this.router.navigate(['/gestion-artistes']);
  }
}
