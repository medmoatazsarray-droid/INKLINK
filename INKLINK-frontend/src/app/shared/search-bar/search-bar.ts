import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Input() placeholder = 'Search products, templates...';
  @Input() iconSrc = 'assets/icons/Vector.svg';
  @Input() wrapperClass: string | string[] | Set<string> | { [klass: string]: any } = '';
  @Input() navigateTo: string | any[] | null = '/explore-products';
  @Input() queryParamKey = 'q';

  searchQuery: string = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

  constructor(private router: Router) {}

  onInput(): void {
    this.searchChange.emit(this.searchQuery.trim().toLowerCase());
  }

  submitSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.searchSubmit.emit(query);

    if (!this.navigateTo) return;

    const commands = Array.isArray(this.navigateTo) ? this.navigateTo : [this.navigateTo];
    const queryParams = query ? { [this.queryParamKey]: query } : {};
    this.router.navigate(commands, { queryParams });
  }
}
