import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id_user: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: string;
  dateInscription: string;
}

export interface UserOrder {
  id_commande: number;
  dateCommande: string;
  statut: string;
  total: number;
  methodePaiement: string;
  produits: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/api/user';

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/${userId}`);
  }

  updateProfile(userId: number, data: Partial<UserProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/${userId}`, data);
  }

  getOrders(userId: number): Observable<UserOrder[]> {
    return this.http.get<UserOrder[]>(`${this.apiUrl}/orders/${userId}`);
  }

  login(email: string, mot_de_passe: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, mot_de_passe });
  }

  register(data: { nom: string; prenom: string; email: string; mot_de_passe: string; telephone?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
