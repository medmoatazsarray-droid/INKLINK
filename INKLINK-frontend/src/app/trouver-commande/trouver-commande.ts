import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-trouver-commande',
  standalone: true,
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './trouver-commande.html',
  styleUrl: './trouver-commande.css'
})
export class TrouverCommandeComponent implements OnInit {

  adminName: string = '';
  currentDate: string = '';
  commande: any = null;
  searchId: string = '';
  newStatut: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'Admin';
    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;

    // Check if coming from ordres page with an id
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadCommandeById(id);
    }
  }

  loadCommandeById(id: string): void {
    this.isLoading = true;
    this.http.get<any>(`${environment.BACKEND_ENDPOINT}/commande/${id}`)
      .subscribe({
        next: (data) => {
          this.commande = data;
          this.newStatut = data.statut;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Commande non trouvée';
          this.isLoading = false;
        }
      });
  }

  onSearch(): void {
    if (!this.searchId.trim()) return;
    this.loadCommandeById(this.searchId);
  }

  getStatutClass(statut: string): string {
    return `statut-${statut}`;
  }

  updateStatut(): void {
    this.http.put(`${environment.BACKEND_ENDPOINT}/commande/${this.commande.id_commande}/statut`, {
      statut: this.newStatut
    }).subscribe({
      next: () => {
        this.commande.statut = this.newStatut;
        this.successMessage = 'Statut mis à jour avec succès!';
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour!';
        console.error(err);
      }
    });
  }

  deleteCommande(): void {
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      this.http.delete(`${environment.BACKEND_ENDPOINT}/commande/${this.commande.id_commande}`)
        .subscribe({
          next: () => this.router.navigate(['/ordres']),
          error: (err) => console.error(err)
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/ordres']);
  }
}
