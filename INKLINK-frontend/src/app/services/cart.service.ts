import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  id_ligne: number;
  id_commande: number;
  id_produit: number;
  quantite: number;
  prixUnitaire: number;
  nom: string;
  prixBase: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3001/api/cart';

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: number, productId: number, quantity: number, price: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, productId, quantity, price });
  }

  getProductIdByName(name: string): Observable<{ id_produit: number }> {
    return this.http.get<{ id_produit: number }>(`http://localhost:3001/api/produit/nom/${encodeURIComponent(name)}`);
  }

  removeFromCart(lineId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item/${lineId}`);
  }
}
