import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type WorkshopElement = {
  id: string;
  name: string;
  src: string;
  className: string;
};

type WorkshopPage = {
  page: 1 | 2;
  target: 'front' | 'back';
  elements: WorkshopElement[];
};

type PlacedElement = {
  id: string;
  x: number;
  y: number;
};

@Component({
  selector: 'app-business-card-workshop-one',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './business-card-workshop-one.html',
  styleUrl: './business-card-workshop-one.css'
})
export class BusinessCardWorkshopOne {
  currentPage: 1 | 2 = 1;

  pages: WorkshopPage[] = [
    {
      page: 1,
      target: 'front',
      elements: [
        { id: 'symbol', name: 'Brand symbol', src: 'assets/icons/element1.svg', className: 'piece-symbol' },
        { id: 'logo', name: 'InkLink logo', src: 'assets/icons/element2.svg', className: 'piece-logo' },
        { id: 'wave', name: 'Red wave', src: 'assets/icons/element4.svg', className: 'piece-wave' }
      ]
    },
    {
      page: 2,
      target: 'back',
      elements: [
        { id: 'logo', name: 'InkLink logo', src: 'assets/icons/element2.svg', className: 'piece-logo' },
        { id: 'wave', name: 'Red wave', src: 'assets/icons/element4.svg', className: 'piece-wave' },
        { id: 'contact', name: 'Contact details', src: 'assets/icons/element5.svg', className: 'piece-contact' }
      ]
    }
  ];

  placedElementsByPage: Record<number, PlacedElement[]> = { 1: [], 2: [] };
  selectedColor = '#2E7C8A';
  private draggedId = '';

  get activePage(): WorkshopPage {
    return this.pages.find((page) => page.page === this.currentPage) || this.pages[0];
  }

  get placedElements(): WorkshopElement[] {
    return this.activePage.elements.filter((element) => this.isPlaced(element.id));
  }

  get trayElements(): WorkshopElement[] {
    return this.activePage.elements.filter((element) => !this.isPlaced(element.id));
  }

  setColor(color: string): void {
    this.selectedColor = color;
  }

  setPage(page: 1 | 2): void {
    this.currentPage = page;
    this.draggedId = '';
  }

  startDrag(id: string): void {
    this.draggedId = id;
  }

  dropOnCanvas(event: DragEvent): void {
    event.preventDefault();
    if (!this.draggedId) {
      return;
    }

    const canvas = event.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = this.clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = this.clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

    this.addToCanvas(this.draggedId, x, y);
    this.draggedId = '';
  }

  addToCanvas(id: string, x = 50, y = 50): void {
    const exists = this.activePage.elements.some((item) => item.id === id);
    if (!exists) {
      return;
    }

    const placed = this.placedElementsByPage[this.currentPage];
    const current = placed.find((item) => item.id === id);

    if (current) {
      current.x = x;
      current.y = y;
    } else {
      this.placedElementsByPage[this.currentPage] = [...placed, { id, x, y }];
    }
  }

  removeFromCanvas(id: string): void {
    this.placedElementsByPage[this.currentPage] = this.placedElementsByPage[this.currentPage].filter((item) => item.id !== id);
  }

  getPosition(id: string): PlacedElement {
    return this.placedElementsByPage[this.currentPage].find((item) => item.id === id) || { id, x: 50, y: 50 };
  }

  reset(): void {
    this.placedElementsByPage[this.currentPage] = [];
  }

  private isPlaced(id: string): boolean {
    return this.placedElementsByPage[this.currentPage].some((item) => item.id === id);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
