import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SearchBar } from '../shared/search-bar/search-bar';
import { CartService } from '../services/cart.service';
import { PromoOfferService } from '../services/promo-offer.service';

interface Kit {
    name: string;
    tags: string[];
    previewImage: string;
    artistNote: string;
    quantity: number;
    style: string;
    includes: string;
    price: number;
    productId?: number;
}

@Component({
    selector: 'app-kit-preview',
    imports: [CommonModule, RouterModule, SearchBar, ],
    templateUrl: './kit-preview.html',
    styleUrl: './kit-preview.css',
})
export class KitPreview implements OnInit {
    kit: Kit = {
        name: '',
        tags: [],
        previewImage: '',
        artistNote: 'Said Khali',
        quantity: 0,
        includes: '',
        style: '',
        price: 0,
        productId: 0
    };


    constructor(private router: Router, private cartService: CartService, private promoOfferService: PromoOfferService) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['data']) {
            const data = navigation.extras.state['data'];
            this.kit = {
                ...this.kit,
                name: data.preview.name,
                previewImage: data.preview.image,
                quantity: data.quantity,
                style: data.style,
                price: data.preview.price || 0,
                productId: data.preview.productId || data.preview.id || 17,
                tags: [
                    `Theme : ${data.style}`,
                    `Couleur : ${data.color}`,
                    `Produit : ${data.product}`
                ]
            };
        }
    }

    ngOnInit(): void { }

    private performAddToCart(callback?: () => void): void {
        const userDataStr = localStorage.getItem('user');
        if (!userDataStr) {
            alert('Please log in to add items to your cart.');
            this.router.navigate(['/login']);
            return;
        }

        try {
            const user = JSON.parse(userDataStr);
            const userId = user.id_user;
            
            this.cartService.addToCart(
                userId,
                this.kit.productId || 17,
                this.kit.quantity,
                this.kit.price
            ).subscribe({

                next: (res) => {
                    console.log('Kit added to cart:', res);
                    alert(`${this.kit.name} added to cart successfully!`);
                    if (callback) callback();
                },
                error: (err) => {
                    console.error('Error adding kit to cart:', err);
                    alert('Failed to add kit to cart. Please try again.');
                }
            });
        } catch (e) {
            console.error('Error in addToCart:', e);
        }
    }

    addToCartAndContinue(): void {
        this.performAddToCart(() => {
            this.router.navigate(['/explore-products']);
        });
    }

    confirmAndAddToCart(): void {
        this.performAddToCart(() => {
            this.router.navigate(['/panier']);
        });
    }

    openPromoModal(): void {
        this.promoOfferService.openPromoModal();
    }

}


