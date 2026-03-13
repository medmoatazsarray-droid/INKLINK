import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Siderbar } from '../shared/siderbar/siderbar';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-rapports',
  imports: [CommonModule, Siderbar, FormsModule],
  templateUrl: './rapports.html',
  styleUrl: './rapports.css',
})
export class Rapports implements OnInit  {

    adminName: string='';
    currentDate : string='';
    totalCommandes : number= 0;
    totalProduits : number= 0;
    totalArtistes : number= 0;
    totalRevenus : number= 0;

    recentOrdres : any[] = [];
    constructor(private http : HttpClient) {}

    ngOnInit(): void {
      this.adminName = localStorage.getItem('adminUsername') || 'admin';
      const now = new Date();
      this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      this.loadStats();
      this.loadRecentOrdres();
    }
    loadStats(): void {
      this.http.get<any>(`${environment.BACKEND_ENDPOINT}/api/stats`).subscribe({
        next: (data) => {
          console.log('Rapport Stats Data:', data);
          this.totalCommandes = data.totalCommandes;
          this.totalProduits = data.totalProduits;
          this.totalArtistes = data.totalArtistes;
          this.totalRevenus = data.totalRevenus;
        },
        error: (err) => console.error('Error fetching stats:', err)
      });
    }
    loadRecentOrdres(): void {
      this.http.get<any[]>(`${environment.BACKEND_ENDPOINT}/api/commandes`).subscribe({
        next: (data) => {
          this.recentOrdres = data.slice(0, 5);
        },
        error: (err) => console.error(err)
      });
    }

}
