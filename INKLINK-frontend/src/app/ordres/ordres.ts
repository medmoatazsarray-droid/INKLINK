  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { HttpClient } from '@angular/common/http';
  import { Siderbar } from '../shared/siderbar/siderbar';

  @Component({
    selector: 'app-orders',
    imports: [CommonModule, FormsModule, Siderbar],
    templateUrl: './ordres.html',
    styleUrl: './ordres.css',
  })
  export class Orders implements OnInit {

    adminName: string = '';
    currentDate: string = '';
    ordres: any[] = [];
    filteredOrdres: any[] = [];
    selectedOrdre: any = null;
    newStatut: string = '';
    activeFilter: string = 'ALL';

    filters = [
      { label: 'Tous', value: 'ALL' },
      { label: 'En attente', value: 'EN_ATTENTE' },
      { label: 'Confirmée', value: 'CONFIRMEE' },
      { label: 'En cours', value: 'EN_COURS' },
      { label: 'Livrée', value: 'LIVREE' },
      { label: 'Annulée', value: 'ANNULEE' }
    ];
    constructor(private http: HttpClient) { }

    ngOnInit(): void {
      this.adminName = localStorage.getItem('adminUsername') || 'admin';
      const now = new Date();
      this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      this.loadOrdres();
    }
    loadOrdres(): void {
      this.http.get<any[]>('http://localhost:3001/api/commandes').subscribe({
        next: (data) => {
          this.ordres = data;
          this.filteredOrdres = data;
        },
        error: (err) => console.error(err)
      });
    }
    setFilter(value: string): void {
      this.activeFilter = value;
      if (value === 'ALL') {
        this.filteredOrdres = this.ordres;
      } else {
        this.filteredOrdres = this.ordres.filter(o => o.statut === value);
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
    viewOrdre(ordre: any): void {
      this.selectedOrdre = ordre;
      this.newStatut = ordre.statut;
    }
    updateStatut(ordre: any): void {
      this.selectedOrdre = ordre;
      this.newStatut = ordre.statut;
    }
    saveStatut(): void {
      this.http.put(`http://localhost:3001/api/commande/${this.selectedOrdre.id_commande}/statut`, {
        statut: this.newStatut
      }).subscribe({
        next: () => {
          this.selectedOrdre.statut = this.newStatut;
          this.closeModal();
          this.loadOrdres();
        },
        error: (err) => console.error(err)
      });
    }
    deleteOrdre(id: number): void {
      if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
        this.http.delete(`http://localhost:3001/api/commande/${id}`).subscribe({
          next: () => {
            this.loadOrdres();
          },
          error: (err) => console.error(err)
        });
      }
    }
    closeModal(): void {
      this.selectedOrdre = null;
      this.newStatut = '';
    }



  }
