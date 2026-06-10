import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SearchBar } from '../shared/search-bar/search-bar';
import { ChallengeService, Challenge } from '../services/challenge.service';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBar, ],
  templateUrl: './challenges.html',
  styleUrls: ['./challenges.css'],
})
export class Challenges implements OnInit, AfterViewInit {
  allChallenges: Challenge[] = [];
  featuredChallenge: Challenge | null = null;
  activeChallenges: Challenge[] = [];
  isLoggedIn = false;
  joinedChallengeIds = new Set<number>();
  
  winner = {
    name: 'Am B.',
    city: 'Sfax',
    defi: 'Eid Poster',
    description: "Son design a été imprimé et partagé sur notre page d'accueil.",
    prize: '200 DT',
  };

  howSteps = [
    {
      icon: 'assets/icons/defi.svg',
      title: 'Choisir un défi',
      description: 'Inspirez-vous des motifs de la médina de Tunis'
    },
    {
      icon: 'assets/icons/creez.svg',
      title: 'Créer avec nos outils',
      description: 'Evitez les couleurs trop vives sur fond noir'
    },
    {
      icon: 'assets/icons/soumettre.svg',
      title: 'Soumettre pour validation',
      description: 'Les artistes vérifiés sélectionnent les meilleurs'
    }
  ];

  constructor(private challengeService: ChallengeService, private router: Router) {}

  ngOnInit(): void {
    this.loadChallenges();
    this.initAuthState();
  }

  ngAfterViewInit(): void {
    this.initRevealOnScroll();
  }

  loadChallenges(): void {
    this.challengeService.getAllChallenges().subscribe({
      next: (data) => {
        this.allChallenges = data;
        this.featuredChallenge = data.find(c => c.titre.includes('Motifs') && c.statut === 'actif') || 
                                 data.find(c => c.statut === 'actif') || 
                                 null;
        
        this.activeChallenges = data.filter(
          c => c.statut === 'actif' && c.id_challenge !== this.featuredChallenge?.id_challenge
        ).sort((a, b) => (a.id_challenge || 0) - (b.id_challenge || 0));
      },
      error: (err) => console.error('Error loading challenges:', err)
    });
  }

  get winnerChallenge(): Challenge | undefined {
    return this.allChallenges.find(c => c.statut === 'termine');
  }

  joinChallenge(challenge: Challenge): void {
    console.log('joining challenge:', challenge.titre);
    if (challenge.id_challenge) {
      this.challengeService.saveJoinState(challenge.id_challenge);
      this.joinedChallengeIds.add(challenge.id_challenge);
    }
    this.router.navigate(['/join-challenge'], { state: { challengeId: challenge.id_challenge }, queryParams: { id: challenge.id_challenge } });
  }

  getJoinStatusText(challengeId: number | undefined): string {
    if (!challengeId) return '';
    const status = this.challengeService.getJoinStatus(challengeId);
    if (!status) return '';
    return status.status === 'en_attente' ? 'En attente de validation' : 'Requête envoyée';
  }

  getButtonLabel(challenge: Challenge): string {
    if (challenge.id_challenge && this.joinedChallengeIds.has(challenge.id_challenge)) {
      return 'Joined';
    }
    return 'Join';
  }

  isButtonDisabled(challenge: Challenge): boolean {
    return !!challenge.id_challenge && this.joinedChallengeIds.has(challenge.id_challenge);
  }

  private initAuthState(): void {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    this.isLoggedIn = !!token;
    if (!token) {
      this.joinedChallengeIds = new Set();
      return;
    }
    const joined = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('challenge_joins') || '{}') 
      : {};
    this.joinedChallengeIds = new Set(Object.keys(joined).map(Number));
    window.addEventListener('storage', () => {
      this.initAuthState();
    });
  }

  private initRevealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
  }
}
