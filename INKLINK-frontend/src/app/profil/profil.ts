import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
}

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  activeTab : string ='overview';
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
  constructor(private router : Router,private http : HttpClient) {}
  ngOnInit(): void {
    this.loadProfile();
  }
  loadProfile(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }
    const userId = JSON.parse(userData).id_user;
    this.http.get<UserProfile >('http ://localhost:3001/api/utilisateur/${userId}').
    subscribe({
      next : (data) => {
        this.user = data;
      },
      error : (err) => {
        console.error('Error loading profile:', err);
        this.router.navigate(['/login']);
      }
    });
    }
    setTab(tab:string):void {
      this.activeTab  = tab;
    }
    modifyPofile() :void {
      this.router.navigate(['/edit-profile']);
    }
  
}
