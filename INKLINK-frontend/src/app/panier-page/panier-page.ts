import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBar } from '../shared/search-bar/search-bar';
import { CartService } from '../services/cart.service';
import { environment } from '../../environments/environment';

interface CartItemLocal {
  id_ligne?: number;
  name: string;
  price: number;
  image: string;
  color?: string;
  text?: string;
  quantity?: number;
}

@Component({
  selector: 'app-panier-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe, SearchBar],
  templateUrl: './panier-page.html',
  styleUrl: './panier-page.css',
})
export class PanierPage implements OnInit, OnDestroy {
  cartItems: CartItemLocal[] = [];
  userId: number | null = null;
  taxRate: number = 0.10;
  shipping: number = 0.00;
  isLoading = false;
  imgUrl: string = environment.IMG_URL;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;

  constructor(private cartService: CartService) { }

  // Try to guess color from product name when backend doesn't provide it
  private extractColorFromName(name?: string): string | null {
    if (!name) return null;
    const colors = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'beige', 'grey', 'gray', 'pink', 'purple', 'brown', 'orange', 'navy', 'maroon', 'teal'];
    const parts = name.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    // check last two tokens for a color
    for (let i = parts.length - 1; i >= Math.max(0, parts.length - 2); i--) {
      if (colors.includes(parts[i])) return this.capitalize(parts[i]);
    }
    // check any token
    for (const p of parts) if (colors.includes(p)) return this.capitalize(p);
    return null;
  }

  private capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id_user;
        if (this.userId) {
          this.loadCart();
        }
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
    // mark body so we can target navbar via global CSS without editing navbar files
    try { document.body.classList.add('panier-active'); } catch (e) { /* noop in non-browser env */ }
  }

  ngOnDestroy(): void {
    try { document.body.classList.remove('panier-active'); } catch (e) { /* noop in non-browser env */ }
  }

  loadCart(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (items) => {
        console.debug('Raw cart response:', items);
        this.cartItems = items.map(item => {
          const src: any = item;
          return {
            id_ligne: src.id_ligne,
            name: src.nom,
            price: Number(src.prixUnitaire) || Number(src.prixBase),
            image: src.image?.startsWith('/uploads')
              ? this.imgUrl + src.image
              : src.image?.startsWith('assets')
                ? src.image
                : `assets/images/all products/${src.image}`,
            quantity: src.quantite || src.quantity || 1,
            // map common customization fields (use as any to avoid TS type errors)
            color: src.couleur || src.color || src.color_name || src.colorLabel || src.couleurProduit || src.colorProduit || src.color_label || src.colorValue || this.extractColorFromName(src.nom),
            text: src.texte || src.text || src.custom_text || src.comment || src.note || src.personalText || src.texte_personnalise || src.customText || null
          } as CartItemLocal;
        });
        console.debug('Mapped cartItems:', this.cartItems);
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart', err);
        this.isLoading = false;
      }
    });
  }

  // Pagination getters
  get totalPages(): number {
    return Math.ceil(this.cartItems.length / this.itemsPerPage);
  }

  get paginatedItems(): CartItemLocal[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.cartItems.slice(start, start + this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  get tax(): number {
    return 10.00;
  }

  get total(): number {
    return parseFloat((this.subtotal + this.shipping + this.tax).toFixed(2));
  }

  removeItem(item: CartItemLocal): void {
    if (item.id_ligne) {
      this.cartService.removeFromCart(item.id_ligne).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(i => i.id_ligne !== item.id_ligne);
          // Adjust page if current page is now empty
          if (this.paginatedItems.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        },
        error: (err) => console.error('Error removing item', err)
      });
    } else {
      this.cartItems = this.cartItems.filter(i => i !== item);
    }
  }

  proceedToCheckout(): void {
    // navigate to checkout
  }
}
