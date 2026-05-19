
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-siderbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './siderbar.html',
  styleUrl: './siderbar.css',
})
export class Siderbar implements OnInit {
  @Input() adminName = 'Admin';

  private profileService = inject(ProfileService);
  showAvatarPicker = false;

  // Feedback modal states
  showFeedbackModal = false;
  feedbackSubmitted = false;
  selectedRating = 5;
  feedbackComment = '';

  get selectedAvatarUrl() {
    return this.profileService.selectedAvatarUrl();
  }

  get avatars() {
    return this.profileService.avatars;
  }

  ngOnInit(): void {
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

  openFeedbackModal(event: Event): void {
    event.preventDefault();
    this.showFeedbackModal = true;
    this.feedbackSubmitted = false;
    this.selectedRating = 5;
    this.feedbackComment = '';
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitFeedback(): void {
    if (!this.feedbackComment.trim()) return;

    this.feedbackSubmitted = true;
    // Auto close after 2 seconds
    setTimeout(() => {
      this.closeFeedbackModal();
    }, 2000);
  }
}
