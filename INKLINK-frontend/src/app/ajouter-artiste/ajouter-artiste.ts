import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { NavbarCom } from '../shared/navbar-com/navbar-com';
import { Footer } from '../shared/footer/footer';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-ajouter-artiste',
  imports: [CommonModule, FormsModule, Siderbar, NavbarCom, Footer],
  templateUrl: './ajouter-artiste.html',
  styleUrl: './ajouter-artiste.css',
})
export class AjouterArtiste implements OnInit {
  adminName = '';
  currentDate = '';

  isEditMode = false;
  editingId: number | null = null;

  nom = '';
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (Number.isInteger(id)) {
        this.isEditMode = true;
        this.editingId = id;
        this.loadForEdit(id);
      }
    }
  }

  loadForEdit(id: number): void {
    this.http.get<any>(`${environment.BACKEND_ENDPOINT}/artiste/${id}`).subscribe({
      next: (data) => {
        this.nom = data?.nom || '';
      },
      error: (err) => (this.errorMessage = err?.error?.message || 'Impossible de charger l\'artiste.'),
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.nom.trim()) { this.errorMessage = 'Le nom est requis'; return; }

    const payload = { nom: this.nom };
    const req$ = this.isEditMode && this.editingId
      ? this.http.put(`${environment.BACKEND_ENDPOINT}/artiste/${this.editingId}`, payload)
      : this.http.post(`${environment.BACKEND_ENDPOINT}/artiste`, payload);

    req$.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Artiste modifié' : 'Artiste ajouté';
        if (!this.isEditMode) this.resetForm();
      },
      error: (err) => (this.errorMessage = err?.error?.message || 'Erreur lors de l\'enregistrement.'),
    });
  }

  resetForm(): void {
    this.nom = '';
  }

  onCancel(): void {
    this.router.navigate(['/gestion-artistes']);
  }
}
