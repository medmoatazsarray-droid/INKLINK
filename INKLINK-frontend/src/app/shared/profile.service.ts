import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // Use a signal for easy reactivity across components
  private _selectedAvatarUrl = signal<string | null>(null);

  public readonly avatars: string[] = [
    // Young Women (20-27)
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophie',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Maya',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Jade',
    
    // Young Men (20-27)
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Jack',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Milo',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Leo',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Finn'
  ];

  get selectedAvatarUrl() {
    return this._selectedAvatarUrl;
  }

  setAvatar(url: string | null) {
    this._selectedAvatarUrl.set(url);
  }
}
