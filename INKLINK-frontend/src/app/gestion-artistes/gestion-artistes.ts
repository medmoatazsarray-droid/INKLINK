import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { NavbarCom } from '../shared/navbar-com/navbar-com';
import { Footer } from '../shared/footer/footer';
import { environment } from '../../environments/environment';

type Artiste = { id_artiste: number; nom: string };

@Component({
  selector: 'app-gestion-artistes',
  standalone: true,
  imports: [CommonModule, Siderbar, NavbarCom, Footer],
  templateUrl: './gestion-artistes.html',
  styleUrl: './gestion-artistes.css',
})
export class GestionArtistes implements OnInit {
  adminName = '';
  currentDate = '';

  artistes: Artiste[] = [];
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.loadArtistes();
  }

  loadArtistes(): void {
    this.errorMessage = '';
    this.http.get<Artiste[]>(`${environment.BACKEND_ENDPOINT}/artiste`).subscribe({
      next: (data) => (this.artistes = data || []),
      error: (err) => {
        this.artistes = [];
        this.errorMessage = err?.error?.message || 'Erreur lors du chargement des artistes.';
      },
    });
  }

  openEdit(a: Artiste): void {
    this.router.navigate(['/ajouter-artiste', a.id_artiste]);
  }

  deleteArtiste(a: Artiste): void {
    const ok = window.confirm(`Supprimer l'artiste "${a.nom}" ?`);
    if (!ok) return;

    this.http.delete(`${environment.BACKEND_ENDPOINT}/artiste/${a.id_artiste}`).subscribe({
      next: () => this.loadArtistes(),
      error: (err) => (this.errorMessage = err?.error?.message || 'Erreur lors de la suppression.'),
    });
  }
}
