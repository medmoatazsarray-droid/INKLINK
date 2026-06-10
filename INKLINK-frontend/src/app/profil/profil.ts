import { Component , OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { UserService, UserOrder } from '../services/user.service';

interface UserProfile {
  id_user : number;
  nom : string;
  prenom  : string;
  email : string;
  telephone : string;
  adresse : string;
  codePostal : string;
  location : string;
  statut : string;
  image : string | null;
  role ?: string;
}

interface MessageItem {
  id_message: number;
  id_artiste: number;
  id_utilisateur: number | null;
  nom_utilisateur: string | null;
  email_utilisateur: string | null;
  contenu: string;
  lu: number | null;
  created_at: string;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  activeTab : string | null = null;
  user: UserProfile = {
    id_user : 0,
    nom : '',
    prenom : '',
    email : '',
    telephone : '',
    adresse : '',
    codePostal : '',
    location : '',
    statut : '',
    image : null
  };

  orders: UserOrder[] = [];
  savedDesigns: any[] = [];
  isLoadingData = false;
  canShowMessages = false;
  showMessagesPanel = false;
  artistId: number | null = null;
  messages: MessageItem[] = [];
  unreadCount = 0;
  isLoadingMessages = false;

  constructor(private router : Router, private http : HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    let userId: number | null = null;
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData) {
      try {
        userId = JSON.parse(userData).id_user;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    if (!userId && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<UserProfile>(`${environment.BACKEND_ENDPOINT}/user/profile/${userId}`).subscribe({
      next : (data) => {
        this.user = data;
        this.detectArtistInbox();
        this.fetchTabData(userId!);
      },
      error : (err) => {
        console.error('Error loading profile:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  private detectArtistInbox(): void {
    const normalizedEmail = this.user?.email?.trim().toLowerCase();
    const normalizedName = `${this.user?.nom || ''} ${this.user?.prenom || ''}`.trim().toLowerCase();

    this.http.get<any[]>(`${environment.BACKEND_ENDPOINT}/artiste`).subscribe({
      next: (artists) => {
        const matchedArtist = artists.find((artist: any) => {
          const artistEmail = String(artist?.email || '').trim().toLowerCase();
          const artistName = String(artist?.nom || '').trim().toLowerCase();
          const emailMatches = normalizedEmail && (
            artistEmail === normalizedEmail ||
            normalizedEmail.includes(artistEmail) ||
            artistEmail.includes(normalizedEmail)
          );
          const nameMatches = normalizedName && artistName && (
            normalizedName.includes(artistName) ||
            artistName.includes(normalizedName)
          );

          return emailMatches || nameMatches;
        });

        this.artistId = matchedArtist ? Number(matchedArtist.id_artiste ?? matchedArtist.id) : null;
        this.canShowMessages = !!this.artistId;

        if (this.artistId) {
          this.loadMessages();
        } else {
          this.messages = [];
          this.unreadCount = 0;
        }
      },
      error: () => {
        this.canShowMessages = false;
        this.artistId = null;
      }
    });
  }

  private loadMessages(): void {
    if (!this.artistId) {
      return;
    }

    this.isLoadingMessages = true;
    this.http.get<any>(`${environment.BACKEND_ENDPOINT}/messages/artist/${this.artistId}`).subscribe({
      next: (response) => {
        this.messages = response?.messages || [];
        this.unreadCount = response?.unreadCount || 0;
        this.isLoadingMessages = false;
      },
      error: () => {
        this.messages = [];
        this.unreadCount = 0;
        this.isLoadingMessages = false;
      }
    });
  }

  toggleMessagesPanel(): void {
    if (!this.artistId) {
      return;
    }

    this.showMessagesPanel = !this.showMessagesPanel;

    if (this.showMessagesPanel && this.unreadCount > 0) {
      this.markMessagesAsRead();
    }
  }

  closeMessagesPanel(): void {
    this.showMessagesPanel = false;
  }

  private markMessagesAsRead(): void {
    if (!this.artistId || this.unreadCount === 0) {
      return;
    }

    this.http.put(`${environment.BACKEND_ENDPOINT}/messages/artist/${this.artistId}/read`, {}).subscribe({
      next: () => {
        this.unreadCount = 0;
        this.messages = this.messages.map((message) => ({ ...message, lu: 1 }));
      },
      error: () => {}
    });
  }

  formatDate(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  fetchTabData(userId: number): void {
    this.userService.getOrders(userId).subscribe(data => this.orders = data);

    try {
      const storageKey = `savedDesigns_${userId}`;
      const savedStr = localStorage.getItem(storageKey);
      if (savedStr) {
        this.savedDesigns = JSON.parse(savedStr);
      } else {
        this.savedDesigns = [];
      }
    } catch (e) {
      console.error('Error loading saved designs from local storage', e);
      this.savedDesigns = [];
    }
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  closePopup(): void {
    this.activeTab = null;
  }

  modifyProfile() :void {
    this.router.navigate(['/edit-profile']);
  }
}

