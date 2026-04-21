import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
  user: any = {};
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.http.get(`${environment.BACKEND_ENDPOINT}/user/profile/${parsed.id_user}`).subscribe({
        next: (data: any) => {
          this.user = data;
          this.imagePreview = data.image;
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.router.navigate(['/profil']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('nom', this.user.nom);
    formData.append('prenom', this.user.prenom);
    formData.append('email', this.user.email);
    formData.append('telephone', this.user.telephone || '');
    formData.append('adresse', this.user.adresse || '');
    formData.append('location', this.user.location || '');
    formData.append('codePostal', this.user.codePostal || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.put(`${environment.BACKEND_ENDPOINT}/user/update-profile/${this.user.id_user}`, formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        // Update local storage if needed
        const currentLocalUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentLocalUser, ...this.user, image: res.image || this.user.image }));
        
        setTimeout(() => {
          this.router.navigate(['/profil']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update profile. Please try again.';
        console.error('Update error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profil']);
  }
}
