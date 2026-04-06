import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  successMsg: string = '';
  private apiUrl = 'http://localhost:3001';
  constructor(private http: HttpClient, private router: Router) { }
  goHome(): void {
    this.router.navigate(['/']);
  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  validate(): boolean {
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.successMsg = '';
    let valid = true;
    if (!this.firstName.trim()) {
      this.firstNameError = 'First name is required.';
      valid = false;
    }
    if (!this.lastName.trim()) {
      this.lastNameError = 'last name is required.';
      valid = false;
    }
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
  onRegister(): void {
    if (!this.validate()) return;
    this.isLoading = true;
    this.http.post(`${this.apiUrl}/api/user/register`, {
      nom: this.lastName,
      prenom: this.firstName,
      email: this.email,
      mot_de_passe: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Account successfully created! Redirecting...';
        setTimeout(() => {
        this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.emailError = 'this email is already registered.';
        } else {
          this.passwordError = 'Something went wrong . Please try again.';
        }
      }
    });
  }
  loginWith(provider: string): void {
    window.location.href = `${this.apiUrl}/auth/${provider}`;
  }
}
