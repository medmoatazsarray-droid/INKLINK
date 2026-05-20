import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PartnersComponent } from '../shared/partners/partners';
import { SearchBar } from '../shared/search-bar/search-bar';

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBar, PartnersComponent],
  templateUrl: './event-page.html',
  styleUrl: './event-page.css',
})
export class EventPage {
  collections = [
    {
      name: 'Cultural collection',
      items: [
        {
          slug: 'restaurant-kit',
          title: 'Restaurant Kit',
          price: 300,
          image: 'assets/images/restaurant-kit.png'
        },
        {
          slug: 'festival-kit',
          title: 'Festival Kit',
          price: 450,
          image: 'assets/images/festival-kit.png'
        },
        {
          slug: 'startup-identity',
          title: 'Startup Identity',
          price: 550,
          image: 'assets/images/startup-identity.png'
        }
      ]
    },
    {
      name: 'Wedding collection',
      items: [
        {
          slug: 'wedding-invitation',
          title: 'Invitation Card',
          price: 420,
          image: 'assets/images/wedding-invitation.png'
        },
        {
          slug: 'wedding-kit',
          title: 'Wedding Kit',
          price: 850,
          image: 'assets/images/wedding-kit.png'
        },
        {
          slug: 'wedding-menu',
          title: 'Menu Card',
          price: 180,
          image: 'assets/images/wedding-menu.png'
        }
      ]
    },
    {
      name: 'Corporate collection',
      items: [
        {
          slug: 'business-card',
          title: 'Business Card',
          price: 200,
          image: 'assets/images/business-card-front.png'
        },
        {
          slug: 'corporate-kit',
          title: 'Corporate Kit',
          price: 650,
          image: 'assets/images/corporate-kit.png'
        },
        {
          slug: 'letterhead',
          title: 'Letterhead',
          price: 120,
          image: 'assets/images/letterhead.png'
        }
      ]
    },
    {
      name: 'Birthday collection',
      items: [
        {
          slug: 'birthday-invitation',
          title: 'Invitation Card',
          price: 200,
          image: 'assets/images/birthday-invitation.png'
        },
        {
          slug: 'birthday-kit',
          title: 'Birthday Kit',
          price: 380,
          image: 'assets/images/birthday-kit.png'
        },
        {
          slug: 'birthday-banner',
          title: 'Banner',
          price: 50,
          image: 'assets/images/birthday-banner.png'
        }
      ]
    }
  ];
}
