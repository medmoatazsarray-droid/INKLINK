import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';
import { ChallengeService, Challenge } from '../services/challenge.service';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBar, PartnersComponent],
  templateUrl: './challenges.html',
  styleUrls: ['./challenges.css'],
})
export class Challenges implements OnInit, AfterViewInit {
  allChallenges: Challenge[] = [];
  featuredChallenge: Challenge | null = null;
  activeChallenges: Challenge[] = [];
  
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

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.loadChallenges();
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
