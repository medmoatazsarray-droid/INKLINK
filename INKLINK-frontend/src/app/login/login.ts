import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  emailError: string = '';
  passwordError: string = '';
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private router: Router) {}
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  validate(): boolean {
    this.emailError = '';
    this.passwordError = '';
    let valid = true;
    if (!this.email) {
      this.emailError = 'Email is required.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Please enter a valid email.';
      valid = false;
    }
    if (!this.password) {
      this.passwordError = 'Password is required.';
      valid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters.';
      valid = false;
    }
    return valid;
  }
  onLogin(): void {
    if (!this.validate()) return;
    this.isLoading = true;
    this.http.post(`${this.apiUrl}/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.passwordError = 'Invalid email or password.';
        } else {
          this.passwordError = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}