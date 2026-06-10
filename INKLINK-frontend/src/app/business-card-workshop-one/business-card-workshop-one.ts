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

  private readonly paletteFilters: Record<string, string> = {
    '#2E7C8A': 'hue-rotate(175deg) saturate(1.2) brightness(1.02)',
    '#E63721': 'hue-rotate(0deg) saturate(1.35) brightness(1.02)',
    '#EAF6F9': 'brightness(1.08) saturate(0.4) contrast(1.02)'
  };

  pages: WorkshopPage[] = [
    {
      page: 1,
      target: 'front',
      elements: [
        { id: 'symbol', name: 'Brand symbol', src: 'assets/icons/element1.svg', className: 'piece-symbol' },
        { id: 'logo', name: 'InkLink logo', src: 'assets/icons/element2.svg', className: 'piece-logo' },
        { id: 'wave', name: 'Color wave', src: 'assets/icons/element4.svg', className: 'piece-wave' }
      ]
    },
    {
      page: 2,
      target: 'back',
      elements: [
        { id: 'logo', name: 'InkLink logo', src: 'assets/icons/element2.svg', className: 'piece-logo' },
        { id: 'wave', name: 'Color wave', src: 'assets/icons/element4.svg', className: 'piece-wave' },
        { id: 'contact', name: 'Contact details', src: 'assets/icons/element5.svg', className: 'piece-contact' }
      ]
    }
  ];

  placedElementsByPage: Record<number, PlacedElement[]> = { 1: [], 2: [] };
  selectedColor = '#2E7C8A';
  canvasDragActive = false;
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

  getColorFilter(color: string): string {
    return this.paletteFilters[color] || 'none';
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
    this.canvasDragActive = true;
  }

  setPage(page: 1 | 2): void {
    this.currentPage = page;
    this.draggedId = '';
  }

  startDrag(event: DragEvent, id: string): void {
    this.draggedId = id;
    event.dataTransfer?.setData('text/plain', id);
    event.dataTransfer?.setData('application/x-inklink-item', id);
    event.dataTransfer!.effectAllowed = 'copyMove';
  }

  dropOnCanvas(event: DragEvent): void {
    event.preventDefault();
    this.canvasDragActive = false;

    const transferredId = event.dataTransfer?.getData('application/x-inklink-item') || event.dataTransfer?.getData('text/plain') || this.draggedId;
    if (!transferredId) {
      return;
    }

    const canvas = event.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;
    const maxX = 100 - this.getPlacementWidth(transferredId);
    const maxY = 100 - this.getPlacementHeight(transferredId);
    const x = this.clamp(rawX, 0, maxX);
    const y = this.clamp(rawY, 0, maxY);

    this.addToCanvas(transferredId, x, y);
    this.draggedId = '';
  }

  addToCanvas(id: string, x = 50, y = 50): void {
    this.canvasDragActive = false;
    const exists = this.activePage.elements.some((item) => item.id === id);
    if (!exists) {
      return;
    }

    const maxX = 100 - this.getPlacementWidth(id);
    const maxY = 100 - this.getPlacementHeight(id);
    const safeX = this.clamp(x, 0, maxX);
    const safeY = this.clamp(y, 0, maxY);

    const placed = this.placedElementsByPage[this.currentPage];
    const current = placed.find((item) => item.id === id);

    if (current) {
      current.x = safeX;
      current.y = safeY;
    } else {
      this.placedElementsByPage[this.currentPage] = [...placed, { id, x: safeX, y: safeY }];
    }
  }

  clearDropState(): void {
    this.canvasDragActive = false;
    this.draggedId = '';
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

  private getPlacementWidth(id: string): number {
    if (id === 'wave' || id === 'contact') {
      return 36;
    }

    if (id === 'logo') {
      return 18;
    }

    return 22;
  }

  private getPlacementHeight(id: string): number {
    if (id === 'wave' || id === 'contact') {
      return 22;
    }

    return 18;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
