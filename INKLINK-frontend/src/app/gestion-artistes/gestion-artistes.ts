import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';

type Artist = {
  id_artiste: number;
  nom: string;
  location: string | null;
  bio: string | null;
  email: string | null;
  telephone: string | null;
  image: string | null;
  skills: string | null;
  type_artiste: string | null;
  statut: string | null;
};

@Component({
  selector: 'app-gestion-artistes',
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './gestion-artistes.html',
  styleUrl: './gestion-artistes.css',
})
export class GestionArtistes implements OnInit {
  adminName = '';
  currentDate = '';

  isLoading = false;
  errorMessage = '';

  allArtists: Artist[] = [];
  filteredArtists: Artist[] = [];

  searchTerm = '';
  selectedType = '';
  selectedStatut = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.loadArtists();
  }

  loadArtists(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Artist[]>(`${environment.BACKEND_ENDPOINT}/artiste`).subscribe({
      next: (data) => {
        this.allArtists = data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.allArtists = [];
        this.filteredArtists = [];
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erreur lors du chargement des artistes.';
      },
    });
  }

  applyFilters(): void {
    let list = [...this.allArtists];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (a) =>
          (a.nom && a.nom.toLowerCase().includes(term)) ||
          (a.email && a.email.toLowerCase().includes(term)) ||
          (a.skills && a.skills.toLowerCase().includes(term)) ||
          (a.type_artiste && a.type_artiste.toLowerCase().includes(term))
      );
    }

    if (this.selectedType) {
      list = list.filter((a) => a.type_artiste === this.selectedType);
    }

    if (this.selectedStatut) {
      list = list.filter((a) => {
        const s = String(a.statut || '').toUpperCase();
        const selected = this.selectedStatut.toUpperCase();
        if (selected === 'ACTIF') {
          return s.startsWith('ACTIF') || s.startsWith('ACTIFE');
        } else if (selected === 'INACTIF') {
          return s.startsWith('INACTIF');
        }
        return s === selected;
      });
    }

    this.filteredArtists = list;
  }

  onFiltersChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedStatut = '';
    this.applyFilters();
  }

  openEdit(artist: Artist): void {
    this.router.navigate(['/ajouter-artiste', artist.id_artiste]);
  }

  deleteArtist(artist: Artist): void {
    const ok = window.confirm(`Supprimer l'artiste "${artist.nom}" ?`);
    if (!ok) return;

    this.http.delete(`${environment.BACKEND_ENDPOINT}/artiste/${artist.id_artiste}`).subscribe({
      next: () => this.loadArtists(),
      error: (err) => {
        this.errorMessage = err?.error?.message || "Erreur lors de la suppression de l'artiste.";
      },
    });
  }
}
