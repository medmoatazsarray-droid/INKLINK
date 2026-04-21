import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  
  emailError = '';
  passwordError = '';
  generalError = '';

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  onLogin(): void {
    // Reset errors
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';

    // Simple validation
    let hasError = false;
    if (!this.email) {
      this.emailError = 'Email is required';
      hasError = true;
    }
    if (!this.password) {
      this.passwordError = 'Password is required';
      hasError = true;
    }

    if (hasError) return;

    this.isLoading = true;
    
    this.http.post(`${environment.BACKEND_ENDPOINT}/user/login`, {
      email: this.email,
      mot_de_passe: this.password
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert('Success');
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('username', res.user.nom);
          localStorage.setItem('userFirstName', res.user.prenom);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.generalError = 'Invalid email or password!';
        alert('password or email wrong');
        console.error('Login error:', err);
      }
    });
  }
}
