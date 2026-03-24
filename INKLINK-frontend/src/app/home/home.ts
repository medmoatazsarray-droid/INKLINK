import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PartnersComponent } from '../shared/partners/partners';
import { environment } from '../../environments/environment';
 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PartnersComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit , OnDestroy {
     searchQuery : string = '';
     currentSlide : number = 0;
     autoSlideInterval : any;
     apiUrl: string = environment.BACKEND_ENDPOINT;
     serviceSlides = [
      {
        title : 'Customising products',
        description : 'create your own customised product : clothing, objects , Marketing...',
        image : 'assets/images/1.png'
      },
      {
        title : 'Our artists creation',
        description : 'Discover and support our artists Agency artists and their cultural creations',
        image : 'assets/images/2.png'
      },
      {
        title : 'Interactive design learning',
        description : 'Learn basic designing skills while customising your product',
        image : 'assets/images/3.png'
      },
      {
        title : 'Design generator',
        description : 'Generate a complete identity in 1 click according to your event (wedding,festival,ramadan...)',
        image : 'assets/images/4.png'
      },
      {
        title : 'AI assistant',
        description : 'Our AI assistant guides you through your personalisation process',
        image : 'assets/images/5.png'
      }
     ];
     get currentMain() {
      return this.serviceSlides[this.currentSlide];
     }
     get currentSecondary() {
      return this.serviceSlides[this.currentSlide + 1] || null;
     }
     get prevSlideIndex(): number {
      const count = this.serviceSlides.length;
      return (this.currentSlide - 1 + count) % count;
     }
     get nextSlideIndex(): number {
      const count = this.serviceSlides.length;
      return (this.currentSlide + 1) % count;
     }
     get totalDots() : number[] {
      return Array.from (
        {length : this.serviceSlides.length},
        (_,i) => i
      );
     }
     allProducts : any[] = [];
     visibleProducts : any[]= [];
     slideIndex : number = 0;
     visibleCount : number = 3;
     
     reviews : any[] = [];
     
     constructor(private http : HttpClient) {}

     ngOnInit(): void {
       this.loadBestsellers();
       this.loadReviews();
       this.startAutoSlide();
     }


     ngOnDestroy(): void {
       if (this.autoSlideInterval) {
         clearInterval(this.autoSlideInterval);
       }
    }
    startAutoSlide(): void {
      this.autoSlideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.serviceSlides.length;
      } , 3500);
    }
    goToSlide(index : number) : void {
      this.currentSlide = index;
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
      }
      this.startAutoSlide();
    }
    loadBestsellers() : void {
      this.allProducts = [
        { name: 'Business card', price: '180.00', image: 'pro card.png', badge: '100 pièce', rating: 4 },
        { name: 'Mug', price: '15.00', image: 'flower mug.png', rating: 4 },
        { name: 'Fountain Pen', price: '08.00', image: 'black pen.png', rating: 4 },
      ];
      this.slideIndex = 0;
      this.visibleCount = 3;
      this.updateVisibleProducts();
    }
    updateVisibleProducts() : void {
      this.visibleProducts = this.allProducts.slice(
        this.slideIndex,
        this.slideIndex + this.visibleCount
      );
    }
    nextSlide() : void {
      if (this.slideIndex + this.visibleCount < this.allProducts.length) {
        this.slideIndex++;
        this.updateVisibleProducts();
      }
    }
    prevSlide() : void {
      if (this.slideIndex > 0) {
        this.slideIndex--;
        this.updateVisibleProducts();
      }
    }
    
  loadReviews(): void {
    this.http.get<any[]>(`${this.apiUrl}/reviews`).subscribe({
      next: (data: any[]) => {
        this.reviews = data;
      },
      error: (err: any) => console.error('Error loading reviews:', err)
    });
  }
} 

