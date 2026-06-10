import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PromoOfferService } from '../../services/promo-offer.service';

@Component({
  selector: 'app-promo-offer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-offer-modal.html',
  styleUrl: './promo-offer-modal.css'
})
export class PromoOfferModalComponent {
  private readonly promoOfferService = inject(PromoOfferService);

  readonly isModalOpen$ = this.promoOfferService.isModalOpen$;
  readonly promoOffer$ = this.promoOfferService.promoOffer$;

  closePromoModal(): void {
    this.promoOfferService.closePromoModal();
  }
}
