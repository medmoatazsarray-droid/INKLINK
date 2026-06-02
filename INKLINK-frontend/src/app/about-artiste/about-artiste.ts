import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchBar } from '../shared/search-bar/search-bar';

interface Artist {
  name: string;
  role: string;
  image: string;
  location?: string;
  bio?: string;
  skills?: string;
  email?: string;
  phone?: string;
}

interface Collection {
  name: string;
  image: string;
}

interface Product {
  name: string;
  image: string;
  price: number;
}

@Component({
  selector: 'app-about-artiste',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBar, FormsModule],
  templateUrl: './about-artiste.html',
  styleUrl: './about-artiste.css',
})
export class AboutArtiste implements OnInit, AfterViewInit {
  private artistId: number | null = null;

  artist: Artist = {
    name: '',
    role: '',
    image: '',
    location: '',
    bio: '',
    skills: '',
    email: '',
    phone: '',
  };

  // Collections loaded from DB (products belonging to Yassine)
  collections: Collection[] = [];

  // Featured creations loaded dynamically
  featuredCreations: Product[] = [];

  featuredIndex = 0;
  visibleCount  = 4;
  
  showContactModal = false;
  messageText = '';

  get visibleFeatured(): Product[] {
    return this.featuredCreations.slice(
      this.featuredIndex,
      this.featuredIndex + this.visibleCount,
    );
  }

  prevFeatured(): void {
    if (this.featuredIndex > 0) this.featuredIndex--;
  }

  nextFeatured(): void {
    if (this.featuredIndex + this.visibleCount < this.featuredCreations.length) {
      this.featuredIndex++;
    }
  }

  toggleContactModal(): void {
    this.showContactModal = !this.showContactModal;
    if (!this.showContactModal) {
      this.messageText = '';
    }
  }

  sendMessage(): void {
    if (this.messageText.trim()) {
      console.log('Message sent:', this.messageText);
      this.messageText = '';
      this.toggleContactModal();
    }
  }

  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  private resolveImage(path: string | null | undefined, fallback: string): string {
    if (!path) return fallback;
    return path.startsWith('http')
      ? path
      : `http://localhost:3001${path.startsWith('/') ? '' : '/'}${path}`;
  }

  ngOnInit(): void {
    this.artistId = Number(this.route.snapshot.paramMap.get('id')) || null;

    this.http.get<any[]>('http://localhost:3001/api/artiste').subscribe({
      next: (artists) => {
        const selectedArtist = this.artistId
          ? artists.find((a) => a.id_artiste === this.artistId || a.id === this.artistId)
          : artists.find((a) => a.nom?.toLowerCase() === 'yassine');

        const targetArtist = selectedArtist ?? artists[0];
        if (!targetArtist) {
          console.error('No artist found to display');
          return;
        }

        this.artist = {
          name:     targetArtist.nom,
          role:     targetArtist.type_artiste || 'Designer',
          image:    this.resolveImage(targetArtist.image, 'assets/icons/profil2.svg'),
          location: targetArtist.location ?? '',
          bio:      targetArtist.bio ?? '',
          skills:   targetArtist.skills ?? '',
          email:    targetArtist.email ?? '',
          phone:    targetArtist.telephone ?? '',
        };

        this.http
          .get<any[]>('http://localhost:3001/api/produit')
          .subscribe({
            next: (products) => {
              const artistProducts = this.artistId
                ? products.filter((p) => p.id_artiste === this.artistId || p.id === this.artistId)
                : products.filter((p) => p.id_artiste === targetArtist.id_artiste || p.id_artiste === targetArtist.id);

              const eventProducts = artistProducts.filter((p) =>
                String(p.categorie_nom || p.category || '')
                  .toLowerCase()
                  .includes('event'),
              );

              this.collections = eventProducts.map((p) => ({
                name:  p.nom,
                image: this.resolveImage(p.image, 'assets/images/placeholder.svg'),
              }));

              const madeByArtistsProducts = artistProducts.filter((p) =>
                String(p.categorie_nom || p.category || '')
                  .toLowerCase()
                  .includes('made by artist'),
              );

              this.featuredCreations = madeByArtistsProducts.map((p) => ({
                name:  p.nom,
                image: this.resolveImage(p.image, 'assets/images/placeholder.svg'),
                price: p.prix || p.price || 0,
              }));
            },
            error: (err) => console.error('Error loading collections:', err),
          });
      },
      error: (err) => console.error('Error loading artists:', err),
    });
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 },
    );
    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((el: HTMLElement) => observer.observe(el));
  }
}
