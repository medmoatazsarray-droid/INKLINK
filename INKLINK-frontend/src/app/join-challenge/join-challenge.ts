import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChallengeService } from '../services/challenge.service';

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
  constructor(private http: HttpClient, private router: Router, private challengeService: ChallengeService) {}
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
    this.generalError = '';
    let hasError = false;
    if (!this.firstName) { this.firstNameError = 'First name is required'; hasError = true; }
    if (!this.lastName)  { this.lastNameError = 'Second name is required'; hasError = true; }
    if (hasError) return;

    this.isLoading = true;

    const challengeId = this.getChallengeIdFromUrl();
    const userId = this.getUserId();

    if (!challengeId) {
      this.isLoading = false;
      this.generalError = 'Challenge not found. Please go back and try again.';
      return;
    }

    if (!userId) {
      this.isLoading = false;
      this.generalError = 'Please log in to join this challenge.';
      return;
    }

    this.http.post(`${environment.BACKEND_ENDPOINT}/challenge/participate`, {
      id_challenge: challengeId,
      id_user: userId
    }).subscribe({
      next: (res) => {
        const joinData: any = { joinedAt: new Date().toISOString(), status: 'en_attente' };
        joinData.firstName = this.firstName;
        joinData.lastName = this.lastName;
        const joined = JSON.parse(localStorage.getItem('challenge_joins') || '{}');
        joined[challengeId] = joinData;
        localStorage.setItem('challenge_joins', JSON.stringify(joined));
        this.isLoading = false;
        this.router.navigate(['/challenges']);
      },
      error: (err) => {
        this.isLoading = false;
        this.generalError = err?.error?.message || 'Something went wrong, please try again.';
        console.error(err);
      }
    });
  }

  private getUserId(): number | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user?.id_user ?? null;
      }
    } catch (e) {}
    return null;
  }

  private getChallengeIdFromUrl(): number | null {
    try {
      if (history.state?.challengeId) {
        const val = Number(history.state.challengeId);
        if (!isNaN(val)) return val;
      }
      const url = new URL(window.location.href);
      const qp = url.searchParams.get('id');
      if (qp) {
        const val = parseInt(qp, 10);
        if (!isNaN(val)) return val;
      }
    } catch (e) {}
    return null;
  }
      }
