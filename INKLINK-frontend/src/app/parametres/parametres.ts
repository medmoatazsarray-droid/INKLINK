import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Siderbar } from '../shared/siderbar/siderbar';
import { environment } from '../../environments/environment';
import { ProfileService } from '../shared/profile.service';

@Component({
  selector: 'app-parametres',
  imports: [CommonModule, FormsModule, Siderbar],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css']
})
export class Parametres implements OnInit {
  adminName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profileImage: string | null = null;
  selectedFile: File | null = null;
  currentDate: string = '';

  private profileService = inject(ProfileService);
  showAvatarPicker = false;

  get selectedAvatarUrl() {
    return this.profileService.selectedAvatarUrl();
  }
  get avatars() {
    return this.profileService.avatars;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.adminName = localStorage.getItem('adminUsername') || 'admin';
    this.email = localStorage.getItem('adminEmail') || '';

    const savedProfile = localStorage.getItem('adminProfileImage');
    if (savedProfile) this.profileImage = this.toAbsoluteUrl(savedProfile);

    this.http.get(`${environment.BACKEND_ENDPOINT}/admin/profile`).subscribe({
      next: (res: any) => {
        if (res?.username) {
          this.adminName = res.username;
          localStorage.setItem('adminUsername', res.username);
        }
        if (res?.email) {
          this.email = res.email;
          localStorage.setItem('adminEmail', res.email);
        }
        if (res?.profile_image) {
          localStorage.setItem('adminProfileImage', res.profile_image);
          this.profileImage = this.toAbsoluteUrl(res.profile_image);
        }
      },
      error: () => {
        // keep localStorage defaults
      }
    });

    const now = new Date();
    this.currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.profileImage = String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  private toAbsoluteUrl(urlOrPath: string): string {
    if (!urlOrPath) return urlOrPath;
    if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
    return `${environment.BACKEND_ENDPOINT}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
  }

  saveParametres(): void {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }

    const formData = new FormData();
    formData.append('username', this.adminName);
    formData.append('email', this.email);
    formData.append('password', this.password);
    if (this.selectedFile) formData.append('profileImage', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

    this.http.put(`${environment.BACKEND_ENDPOINT}/admin/update`, formData, { headers }).subscribe({
      next: (res: any) => {
        alert('Paramètres sauvegardés !');
        if (res?.admin?.username) localStorage.setItem('adminUsername', res.admin.username);
        if (res?.admin?.email) localStorage.setItem('adminEmail', res.admin.email);
        if (res?.admin?.profile_image) {
          localStorage.setItem('adminProfileImage', res.admin.profile_image);
          this.profileImage = this.toAbsoluteUrl(res.admin.profile_image);
        }
        this.password = '';
        this.confirmPassword = '';
        this.selectedFile = null;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erreur lors de la sauvegarde.';
        const details = err?.error?.details;
        alert(details ? `${msg} (${details})` : msg);
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.ngOnInit();
    this.password = '';
    this.confirmPassword = '';
    this.selectedFile = null;
  }

  get adminInitial(): string {
    return this.adminName ? this.adminName.charAt(0).toUpperCase() : 'A';
  }

  toggleAvatarPicker(): void {
    this.showAvatarPicker = !this.showAvatarPicker;
  }

  selectAvatar(url: string): void {
    this.profileService.setAvatar(url);
    this.showAvatarPicker = false;
  }
}
