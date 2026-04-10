import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Challenge {
  id_challenge?: number;
  titre: string;
  description: string;
  prix_gagnant: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  tag: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://localhost:3001/api/challenge';

  constructor(private http: HttpClient) {}

  getAllChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.apiUrl);
  }

  getChallengeById(id: number): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.apiUrl}/${id}`);
  }

  createChallenge(challenge: Challenge): Observable<any> {
    return this.http.post(this.apiUrl, challenge);
  }

  updateChallenge(id: number, challenge: Challenge): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, challenge);
  }

  deleteChallenge(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
