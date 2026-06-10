import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { SearchBar } from '../shared/search-bar/search-bar';

interface EventKit {
  slug: string;
  title: string;
  price: number;
  image: string;
}

interface EventCollection {
  name: string;
  items: EventKit[];
}

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [CommonModule, SearchBar, RouterLink],

  templateUrl: './event-page.html',
  styleUrl: './event-page.css',
})
export class EventPage {
  collections: EventCollection[] = [
    {
      name: 'cultural collection',
      items: [
        {
          slug: 'restaurant-kit',
          title: 'Restaurant kit',
          price: 300,
          image: 'assets/images/cult0.png',
        },
        {
          slug: 'festival-kit',
          title: 'Festival Kit',
          price: 450,
          image: 'assets/images/cult1.png',
        },
        {
          slug: 'startup-identity',
          title: 'Startup Identity',
          price: 550,
          image: 'assets/images/cult2.png',
        },
        {
          slug: 'traditional-marriage',
          title: 'Traditional Marriage',
          price: 350,
          image: 'assets/images/traditional marriage.png',
        },
      ],
    },
  ];

  selectedEventSlugByCollection: Record<string, string> = {};
  ctaPulseByCollection: Record<string, boolean> = {};
  private ctaPulseTimers: Record<string, number | undefined> = {};

  constructor(private router: Router, private el: ElementRef) {
    this.collections.forEach((collection) => {
      this.selectedEventSlugByCollection[collection.name] = collection.items[1]?.slug ?? collection.items[0].slug;
      this.ctaPulseByCollection[collection.name] = false;
    });
  }

  selectEvent(collection: EventCollection, item: EventKit): void {
    this.selectedEventSlugByCollection[collection.name] = item.slug;
    this.triggerCtaPulse(collection.name);
  }

  getFeaturedEvent(collection: EventCollection): EventKit {
    return collection.items[1] ?? collection.items[0];
  }

  getSelectedEvent(collection: EventCollection): EventKit {
    const selectedSlug = this.selectedEventSlugByCollection[collection.name];
    return collection.items.find((item) => item.slug === selectedSlug) ?? this.getFeaturedEvent(collection);
  }

  getVisibleEvents(collection: EventCollection): EventKit[] {
    const selectedEvent = this.getSelectedEvent(collection);
    const remainingEvents = collection.items.filter((item) => item.slug !== selectedEvent.slug);
    return [remainingEvents[0], selectedEvent, remainingEvents[1]].filter(Boolean) as EventKit[];
  }

  getSelectedEventSlug(collection: EventCollection): string {
    return this.selectedEventSlugByCollection[collection.name] ?? this.getFeaturedEvent(collection).slug;
  }

  openSelectedEvent(collection: EventCollection): void {
    void this.router.navigate(['/events', this.getSelectedEventSlug(collection)]);
  }

  private triggerCtaPulse(collectionName: string): void {
    this.ctaPulseByCollection[collectionName] = false;

    if (this.ctaPulseTimers[collectionName]) {
      window.clearTimeout(this.ctaPulseTimers[collectionName]);
    }

    this.ctaPulseTimers[collectionName] = window.setTimeout(() => {
      this.ctaPulseByCollection[collectionName] = true;

      this.ctaPulseTimers[collectionName] = window.setTimeout(() => {
        this.ctaPulseByCollection[collectionName] = false;
      }, 260);
    }, 20);
  }

    
}
