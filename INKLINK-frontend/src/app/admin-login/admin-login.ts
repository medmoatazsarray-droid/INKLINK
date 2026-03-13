import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  showPassword = false;

  constructor(private http: HttpClient , private router : Router) {}

  onSubmit() {
    this.http.post(`${environment.BACKEND_ENDPOINT}/admin/login`, {
      username: this.username,
      password: this.password
    }).subscribe(
      (res: any) => {
        alert('Login successful!');
        console.log(res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('adminUsername', res.admin.username);
        if (res?.admin?.email) localStorage.setItem('adminEmail', res.admin.email);
        if (res?.admin?.profile_image) localStorage.setItem('adminProfileImage', res.admin.profile_image);
        this.router.navigate(['/dashboard']);
      },
      err => {
        const msg = err?.error?.message || 'Login failed!';
        alert(msg);
        console.error(err);
      }
    );
  }
}
