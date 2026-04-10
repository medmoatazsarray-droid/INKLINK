import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { ChallengeService, Challenge } from '../services/challenge.service';

@Component({
  selector: 'app-ajouter-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './ajouter-challenge.html',
  styleUrl: './ajouter-challenge.css',
})
export class AjouterChallenge implements OnInit {
  adminName = '';
  currentDate = '';
  isEditMode = false;
  successMessage = '';
  errorMessage = '';

  challenge: Challenge = {
    titre: '',
    description: '',
    prix_gagnant: 0,
    date_debut: '',
    date_fin: '',
    statut: 'actif',
    tag: 'featured'
  };

  constructor(
    private challengeService: ChallengeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadChallenge(Number(id));
    }
  }

  loadChallenge(id: number): void {
    this.challengeService.getChallengeById(id).subscribe({
      next: (data) => {
        this.challenge = data;
        
        // Format dates for input[type="date"]
        if (this.challenge.date_debut) {
            this.challenge.date_debut = new Date(this.challenge.date_debut).toISOString().split('T')[0];
        }
        if (this.challenge.date_fin) {
            this.challenge.date_fin = new Date(this.challenge.date_fin).toISOString().split('T')[0];
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du challenge.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.challenge.titre || !this.challenge.date_debut || !this.challenge.date_fin) {
      this.errorMessage = 'Veuillez remplir le titre et les deux dates.';
      return;
    }

    if (this.isEditMode && this.challenge.id_challenge) {
      this.challengeService.updateChallenge(this.challenge.id_challenge, this.challenge).subscribe({
        next: () => {
          this.successMessage = 'Challenge mis à jour avec succès !';
          setTimeout(() => this.router.navigate(['/gestion-challenge']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour du challenge.';
        }
      });
    } else {
      this.challengeService.createChallenge(this.challenge).subscribe({
        next: () => {
          this.successMessage = 'Challenge créé avec succès !';
          setTimeout(() => this.router.navigate(['/gestion-challenge']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création du challenge.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/gestion-challenge']);
  }
}
