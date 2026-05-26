import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router , RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-join-challenge',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './join-challenge.html',
  styleUrl: './join-challenge.css',
})
export class JoinChallenge {
  firstName = '';
  lastName = '';
  fileName = '';
  selectedFile : File | null = null;
  isLoading = false;
  firstNameError = '';
  lastNameError = '';
  fileError = '';
  generalError = '';
  constructor(private http: HttpClient, private router: Router) {}
  goHome(): void {
    this.router.navigate(['/home']);
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 ) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      this.fileError = '';
    }
  }
  signInWith(provider: string): void {
    //handle social login
  }
  onSubmit(): void {
    this.firstNameError = '';
    this.lastNameError = '';
    this.fileError = '';
    this.fileError = '';
    this.generalError = '';
    let hasError = false;
    if (!this.firstName) {
      this.firstNameError = 'First name is required';
      hasError = true; }
      if (!this.lastName) 
      {
        this.lastNameError = 'Second name is required'; hasError = true ; }
        if (!this.selectedFile) {
          this.fileError = 'Please upload your design'; hasError = true; }
          if (hasError) return;
          this.isLoading = true ;
          const formData = new FormData();
          formData.append('firstName', this.firstName);
          formData.append('lastName', this.lastName);
          formData.append('design',this.selectedFile !);
          this.http.post(
            `${environment.BACKEND_ENDPOINT}/challenge/submit`,
            formData
          ).subscribe({
              next : () => {
                this.isLoading = false;
                this.router.navigate(['/home']);
              },
              error : (err) => {
                this.isLoading = false;
                this.generalError = 'something went wrong, please try again .';
                console.error(err);
              }
            });
        }
      }
