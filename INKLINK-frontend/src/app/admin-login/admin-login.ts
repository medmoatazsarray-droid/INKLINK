import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:3001/api/admin/login', {
      username: this.username,
      password: this.password
    }).subscribe(
      (res: any) => {
        alert('Login successful!');
        console.log(res);
        localStorage.setItem('token', res.token);
      },
      err => {
        alert('Login failed!');
        console.error(err);
      }
    );
  }
}