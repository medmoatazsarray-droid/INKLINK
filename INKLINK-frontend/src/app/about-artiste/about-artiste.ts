import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';

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
  imports: [CommonModule, RouterModule, SearchBar, PartnersComponent],
  templateUrl: './about-artiste.html',
  styleUrl: './about-artiste.css',
})
export class AboutArtiste implements OnInit, AfterViewInit {

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

  constructor(private http: HttpClient, private el: ElementRef) {}

  private resolveImage(path: string | null | undefined, fallback: string): string {
    if (!path) return fallback;
    return path.startsWith('http')
      ? path
      : `http://localhost:3001${path.startsWith('/') ? '' : '/'}${path}`;
  }

  ngOnInit(): void {
    // Load Yassine's profile from the API
    this.http.get<any[]>('http://localhost:3001/api/artiste').subscribe({
      next: (artists) => {
        const yassine = artists.find(
          (a) => a.nom?.toLowerCase() === 'yassine',
        );
        if (yassine) {
          this.artist = {
            name:     yassine.nom,
            role:     yassine.type_artiste || 'Designer',
            image:    this.resolveImage(yassine.image, 'assets/icons/profil2.svg'),
            location: yassine.location ?? '',
            bio:      yassine.bio ?? '',
            skills:   yassine.skills ?? '',
            email:    yassine.email ?? '',
            phone:    yassine.telephone ?? '',
          };

          // Load his products/collections using his id_artiste
          this.http
            .get<any[]>('http://localhost:3001/api/produit')
            .subscribe({
              next: (products) => {
                const artistProducts = products.filter((p) => p.id_artiste === yassine.id_artiste);
                
                this.collections = artistProducts.map((p) => ({
                    name:  p.nom,
                    image: this.resolveImage(p.image, 'assets/images/placeholder.svg'),
                }));
                
                this.featuredCreations = artistProducts.map((p) => ({
                    name: p.nom,
                    image: this.resolveImage(p.image, 'assets/images/placeholder.svg'),
                    price: p.prix || p.price || 0
                }));
              },
              error: (err) =>
                console.error('Error loading collections:', err),
            });
        }
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
