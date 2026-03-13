import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reset-password.html',
  styleUrl: './admin-reset-password.css'
})
export class AdminResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  showPasswords = false;
  isLoading = false;
  tokenValid = false;
  message = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'Reset token is missing.';
      return;
    }

    this.http.post<any>(`${environment.BACKEND_ENDPOINT}/admin/verify-reset-token`, { token: this.token })
      .subscribe({
        next: () => {
          this.tokenValid = true; 
        },
        error: () => {
          this.errorMessage = 'This reset link is invalid or expired.';
          this.tokenValid = false;
        }
      });
  }

  onSubmit(): void {
    if (!this.tokenValid || this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.message = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.http.post<any>(`${environment.BACKEND_ENDPOINT}/admin/reset-password`, {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = response.message || 'Password reset successful.';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => this.router.navigate(['/admin']), 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Failed to reset password.';
      }
    });
  }
}
