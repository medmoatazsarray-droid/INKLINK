
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-siderbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './siderbar.html',
  styleUrl: './siderbar.css',
})
export class Siderbar implements OnInit {
  @Input() adminName = 'Admin';

  private profileService = inject(ProfileService);
  showAvatarPicker = false;

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
}
