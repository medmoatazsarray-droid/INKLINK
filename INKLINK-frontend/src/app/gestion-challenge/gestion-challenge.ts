import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { ChallengeService, Challenge } from '../services/challenge.service';

@Component({
  selector: 'app-gestion-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './gestion-challenge.html',
  styleUrl: './gestion-challenge.css',
})
export class GestionChallenge implements OnInit {
  adminName = '';
  currentDate = '';

  isLoading = false;
  errorMessage = '';

  challenges: Challenge[] = [];
  filteredChallenges: Challenge[] = [];
  searchTerm = '';

  constructor(private challengeService: ChallengeService, private router: Router) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    this.loadChallenges();
  }

  loadChallenges(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.challengeService.getAllChallenges().subscribe({
      next: (data) => {
        this.challenges = data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des challenges.';
        console.error(err);
      }
    });
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredChallenges = [...this.challenges];
    } else {
      const q = this.searchTerm.toLowerCase().trim();
      this.filteredChallenges = this.challenges.filter(c => 
        c.titre.toLowerCase().includes(q) || 
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
  }

  openEdit(challenge: Challenge): void {
    this.router.navigate(['/ajouter-challenge', challenge.id_challenge]);
  }

  deleteChallenge(challenge: Challenge): void {
    if (!challenge.id_challenge) return;
    const ok = window.confirm(`Supprimer le challenge "${challenge.titre}" ?`);
    if (!ok) return;

    this.challengeService.deleteChallenge(challenge.id_challenge).subscribe({
      next: () => {
        this.loadChallenges();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du challenge.';
        console.error(err);
      }
    });
  }
}
