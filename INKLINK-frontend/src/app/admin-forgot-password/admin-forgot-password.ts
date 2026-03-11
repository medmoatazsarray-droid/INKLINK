import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../api';

@Component({
  selector: 'app-admin-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-forgot-password.html',
  styleUrl: './admin-forgot-password.css'
})
export class AdminForgotPasswordComponent {
  email = '';
  successMessage = '';
  errorMessage = '';
  previewUrl = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre adresse e-mail';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.previewUrl = '';

    this.http.post<any>(`${API_BASE_URL}/api/admin/forgot-password`, { email: this.email })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          this.previewUrl = response.previewUrl;
          this.email = '';
          console.log('Response:', response);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          console.error('Error:', error);
        }
      });
  }
}
