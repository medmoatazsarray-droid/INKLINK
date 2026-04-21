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
        // Pre-fetch some counts for Overview if needed, or just fetch all
        this.fetchTabData(userId!);
      },
      error : (err) => {
        console.error('Error loading profile:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  fetchTabData(userId: number): void {
    this.userService.getOrders(userId).subscribe(data => this.orders = data);
    
    // Load saved designs from local storage for the specific user
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

