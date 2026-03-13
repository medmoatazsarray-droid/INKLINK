import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './ordres.html',
  styleUrl: './ordres.css'
})
export class Orders implements OnInit {
  adminName: string = '';
  currentDate: string = '';
  ordres: any[] = [];
  filteredOrdres: any[] = [];
  activeFilter: string = 'all';

  filters = [
    { label: 'Tous', value: 'all' },
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Confirmée', value: 'CONFIRMEE' },
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'Livrée', value: 'LIVREE' },
    { label: 'Annulée', value: 'ANNULEE' }
  ];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<any[]>(`${environment.BACKEND_ENDPOINT}/commande`).subscribe({
      next: (data) => {
        this.ordres = data;
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredOrdres = this.ordres;
    } else {
      this.filteredOrdres = this.ordres.filter(o => o.statut === this.activeFilter);
    }
  }

  getStatutClass(statut: string): string {
    const classes: any = {
      'EN_ATTENTE': 'statut-en-attente',
      'CONFIRMEE': 'statut-confirmee',
      'EN_COURS': 'statut-en-cours',
      'LIVREE': 'statut-livree',
      'ANNULEE': 'statut-annulee'
    };
    return classes[statut] || '';
  }

  viewOrdre(order: any): void {
    // Navigate to dedicated page instead of opening modal
    this.router.navigate(['/trouver-commande'], { queryParams: { id: order.id_commande } });
  }

  deleteOrdre(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet ordre ?')) {
      this.http.delete(`${environment.BACKEND_ENDPOINT}/commande/${id}`).subscribe({
        next: () => {
          this.ordres = this.ordres.filter(o => o.id_commande !== id);
          this.applyFilter();
        },
        error: (err) => console.error('Error deleting order:', err)
      });
    }
  }
}