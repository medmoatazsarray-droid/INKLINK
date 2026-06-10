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
  messageStatus = '';
  messageError = '';
  unreadCount = 0;
  isSending = false;

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
      this.messageStatus = '';
      this.messageError = '';
    }
  }

  private loadMessages(): void {
    if (!this.artistId) {
      return;
    }

    this.http.get<any>(`http://localhost:3001/api/messages/artist/${this.artistId}`).subscribe({
      next: (response) => {
        this.unreadCount = response?.unreadCount || 0;
      },
      error: () => {
        this.unreadCount = 0;
      },
    });
  }

  sendMessage(): void {
    const trimmedMessage = this.messageText.trim();
    if (!trimmedMessage || !this.artistId || this.isSending) {
      return;
    }

    this.isSending = true;
    this.messageError = '';
    this.messageStatus = '';

    const loggedInUser = this.getLoggedInUser();
    const senderName = loggedInUser?.nom || loggedInUser?.name || 'Visitor';
    const senderEmail = loggedInUser?.email || null;
    const userId = loggedInUser?.id_user || loggedInUser?.id || null;

    this.http.post('http://localhost:3001/api/messages', {
      id_artiste: this.artistId,
      contenu: trimmedMessage,
      nom_utilisateur: senderName,
      email_utilisateur: senderEmail,
      id_utilisateur: userId,
    }).subscribe({
      next: () => {
        this.messageStatus = 'Your message has been sent successfully.';
        this.messageText = '';
        this.unreadCount += 1;
        this.isSending = false;
        setTimeout(() => this.toggleContactModal(), 600);
      },
      error: () => {
        this.isSending = false;
        this.messageError = 'Unable to send the message right now. Please try again.';
      },
    });
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

  private getLoggedInUser(): any {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }

  private resolveTargetArtist(artists: any[]): any {
    const explicitArtistId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (explicitArtistId) {
      const byRoute = artists.find((a) => a.id_artiste === explicitArtistId || a.id === explicitArtistId);
      if (byRoute) {
        return byRoute;
      }
    }

    const loggedInUser = this.getLoggedInUser();
    const normalizedEmail = String(loggedInUser?.email || '').trim().toLowerCase();
    const normalizedName = String(loggedInUser?.nom || loggedInUser?.name || '').trim().toLowerCase();

    if (normalizedEmail) {
      const byEmail = artists.find((a) => String(a.email || '').trim().toLowerCase() === normalizedEmail);
      if (byEmail) {
        return byEmail;
      }
    }

    if (normalizedName) {
      const byName = artists.find((a) => String(a.nom || '').trim().toLowerCase() === normalizedName);
      if (byName) {
        return byName;
      }
    }

    return artists.find((a) => String(a.nom || '').trim().toLowerCase() === 'yassine') ?? artists[0];
  }

  ngOnInit(): void {
    this.artistId = Number(this.route.snapshot.paramMap.get('id')) || null;

    this.http.get<any[]>('http://localhost:3001/api/artiste').subscribe({
      next: (artists) => {
        const targetArtist = this.resolveTargetArtist(artists);
        if (!targetArtist) {
          console.error('No artist found to display');
          return;
        }
        if (!targetArtist) {
          console.error('No artist found to display');
          return;
        }

        this.artistId = Number(targetArtist.id_artiste ?? targetArtist.id) || null;

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

        this.loadMessages();

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
