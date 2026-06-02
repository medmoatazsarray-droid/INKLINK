import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

interface EventKit {
  slug: string;
  title: string;
  price: number;
  collection: string;
  description: string;
  images: string[];
  includes: string[];
  specs: { icon: string; label: string; value: string }[];
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailComponent implements OnInit {

  event: EventKit | undefined;
  selectedImage: string = '';
  quantity: number = 1;
  relatedEvents: any[] = [];

  private allEvents: EventKit[] = [
    {
      slug: 'festival-kit',
      title: 'Festival Kit',
      price: 450,
      collection: 'Cultural collection',
      description: 'A complete branding package for cultural festivals. Designed to reflect Tunisian heritage with modern print quality. Perfect for festivals, exhibitions, and cultural gatherings.',
      images: ['assets/images/cult1.png', 'assets/images/cult1.png', 'assets/images/cult1.png'],
      includes: ['500 Flyers (A5)', '2 Roll-up Banners (80x200cm)', '200 Event Badges', '100 Programs (A4 folded)', '50 Posters (A2)', 'Custom packaging stickers'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Offset + Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '5-7 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'restaurant-kit',
      title: 'Restaurant Kit',
      price: 300,
      collection: 'Cultural collection',
      description: 'Everything your restaurant needs to stand out. From menus to placemats, this kit gives your establishment a cohesive and professional identity.',
      images: ['assets/images/cult0.png', 'assets/images/cult0.png'],
      includes: ['100 Menus (A4 laminated)', '200 Business Cards', '50 Table Placemats', '500 Takeaway Bags (printed)', 'Custom logo stickers x100'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '3-5 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'startup-identity',
      title: 'Startup Identity',
      price: 550,
      collection: 'Cultural collection',
      description: 'Launch your startup with a complete brand identity kit. Everything you need to make a strong first impression from day one.',
      images: ['assets/images/cult2.png', 'assets/images/cult2.png'],
      includes: ['500 Business Cards', '200 Letterheads', '100 Envelopes', '2 Roll-up Banners', '50 Folders', 'Custom stickers x200'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Offset' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '7-10 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'traditional-marriage',
      title: 'Traditional Marriage',
      price: 350,
      collection: 'Cultural collection',
      description: 'A traditional Tunisian wedding print kit with elegant motifs and premium finishes to celebrate your special day.',
      images: ['assets/images/traditional marriage.png'],
      includes: ['200 Invitation Cards', '200 Envelopes', '50 Menu Cards', '20 Table Cards', 'Welcome Sign (A1)'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital + Foil' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '5-7 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'wedding-kit',
      title: 'Wedding Kit',
      price: 850,
      collection: 'Wedding collection',
      description: 'Make your wedding unforgettable with our complete print package. Every detail crafted with love and precision for your special day.',
      images: ['assets/images/wedding-kit.png', 'assets/images/wedding-kit-2.png'],
      includes: ['200 Invitation Cards', '200 Envelopes', '50 Menu Cards', '20 Table Number Cards', 'Welcome Sign (A1)', '500 Confetti bags'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Offset + Foil' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '7-10 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'wedding-invitation',
      title: 'Invitation Card',
      price: 420,
      collection: 'Wedding collection',
      description: 'Elegant wedding invitation cards crafted with premium paper and refined typography to set the tone for your celebration.',
      images: ['assets/images/wedding-invitation.png'],
      includes: ['200 Invitation Cards', '200 Envelopes', 'Custom wax seal stickers x50'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital + Foil' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '3-5 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'wedding-menu',
      title: 'Menu Card',
      price: 180,
      collection: 'Wedding collection',
      description: 'Beautifully designed menu cards that match your wedding theme and delight your guests from the very first glance.',
      images: ['assets/images/wedding-menu.png'],
      includes: ['50 Menu Cards (A5)', 'Custom typography', 'Matte lamination'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '2-3 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'corporate-kit',
      title: 'Corporate Kit',
      price: 650,
      collection: 'Corporate collection',
      description: 'A full corporate identity package to present your company with professionalism and confidence in every interaction.',
      images: ['assets/images/corporate-kit.png', 'assets/images/corporate-kit-2.png'],
      includes: ['500 Business Cards', '200 Letterheads', '100 Envelopes', '50 Presentation Folders', '2 Roll-up Banners', '100 Notepads'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Offset' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '7-10 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'business-card',
      title: 'Business Card',
      price: 200,
      collection: 'Corporate collection',
      description: 'Premium business cards printed on 350g/m² coated stock with matte or gloss lamination for a lasting impression.',
      images: ['assets/images/business-card-front.png', 'assets/images/business-card-back.png'],
      includes: ['500 Business Cards', 'Double-sided print', 'Matte or gloss lamination', 'Standard 85x55mm format'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Offset' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '2-3 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'letterhead',
      title: 'Letterhead',
      price: 120,
      collection: 'Corporate collection',
      description: 'Professional letterheads that reinforce your brand identity in every official communication.',
      images: ['assets/images/letterhead.png'],
      includes: ['200 Letterheads (A4)', '80g premium paper', 'Custom logo placement'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '2-3 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'birthday-kit',
      title: 'Birthday Kit',
      price: 380,
      collection: 'Birthday collection',
      description: 'Make every birthday celebration special with our complete print kit. Fun, vibrant, and fully customisable for any age.',
      images: ['assets/images/birthday-kit.png', 'assets/images/birthday-kit-2.png'],
      includes: ['100 Invitation Cards', '1 Large Banner (100x200cm)', '200 Party Stickers', '50 Thank You Cards', 'Custom name tags x50'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '3-5 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'birthday-invitation',
      title: 'Invitation Card',
      price: 200,
      collection: 'Birthday collection',
      description: 'Colourful and playful birthday invitation cards that get your guests excited from the moment they open the envelope.',
      images: ['assets/images/birthday-invitation.png'],
      includes: ['100 Invitation Cards', '100 Envelopes', 'Custom text and colours'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '2-3 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    },
    {
      slug: 'birthday-banner',
      title: 'Banner',
      price: 50,
      collection: 'Birthday collection',
      description: 'Bold and bright birthday banners that transform any space into a celebration zone instantly.',
      images: ['assets/images/birthday-banner.png'],
      includes: ['1 Banner (100x200cm)', 'Full colour print', 'Reinforced eyelets'],
      specs: [
        { icon: 'fa-print', label: 'Print Method', value: 'Digital' },
        { icon: 'fa-clock', label: 'Delivery Time', value: '1-2 business days' },
        { icon: 'fa-leaf', label: 'Ink Type', value: 'Vegetable-based inks' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      this.event = this.allEvents.find(e => e.slug === slug);
      if (this.event) {
        this.selectedImage = this.event.images[0];
        this.quantity = 1;
        this.relatedEvents = this.allEvents.filter(
          e => e.collection === this.event!.collection && e.slug !== slug
        );
      }
    });
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.event) return;
    if (this.quantity <= 0) return;

    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    const getProductId = (): number => {
      const hash = this.event!.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return 1000 + (hash % 9000);
    };

    const productId = getProductId();
    const user = JSON.parse(userDataStr);
    const userId = user.id_user;
    if (!userId) return;

    this.cartService.addToCart(userId, productId, this.quantity, this.event!.price).subscribe({
      next: () => this.router.navigate(['/panier']),
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }

    
}
