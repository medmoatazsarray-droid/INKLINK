import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PromoOfferService {
  private readonly apiUrl = environment.BACKEND_ENDPOINT;
  private readonly promoOfferSubject = new BehaviorSubject<any>(null);
  private readonly isModalOpenSubject = new BehaviorSubject<boolean>(false);
  private hasLoaded = false;

  readonly promoOffer$ = this.promoOfferSubject.asObservable();
  readonly isModalOpen$ = this.isModalOpenSubject.asObservable();

  constructor(private http: HttpClient) {}

  openPromoModal(): void {
    if (this.hasLoaded && this.promoOfferSubject.value) {
      this.isModalOpenSubject.next(true);
      return;
    }

    this.http.get<any>(`${this.apiUrl}/codepromo/active`).subscribe({
      next: (data) => {
        this.hasLoaded = true;
        this.promoOfferSubject.next(data && typeof data === 'object' ? data : this.getDefaultPromo());
        this.isModalOpenSubject.next(true);
      },
      error: () => {
        this.hasLoaded = true;
        this.promoOfferSubject.next(this.getDefaultPromo());
        this.isModalOpenSubject.next(true);
      }
    });
  }

  closePromoModal(): void {
    this.isModalOpenSubject.next(false);
  }

  private getDefaultPromo(): any {
    return {
      title: 'Seasonal promotion',
      description: 'Order 3 products from the same category and benefit from free delivery.',
      discount: 15,
      badgeText: '-15%',
      validUntil: null
    };
  }
}
