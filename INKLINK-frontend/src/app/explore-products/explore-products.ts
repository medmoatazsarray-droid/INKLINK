import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PartnersComponent } from '../shared/partners/partners';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

interface Product {
  name: string;
  price: string | number;
  image: string;
  badge?: string | null;
}

interface Category {
  name: string;
  products: Product[];
  currentPage: number;
  totalPages: number;
  paginatedProducts: Product[];
}

@Component({
  selector: 'app-explore-products',
  standalone: true,
  imports: [CommonModule, FormsModule, PartnersComponent],
  templateUrl: './explore-products.html',
  styleUrl: './explore-products.css',
})
export class ExploreProducts implements OnInit, OnDestroy {
  @ViewChild('searchContainer', { static: true })
  private searchContainer?: ElementRef<HTMLElement>;

  apiUrl: string = environment.BACKEND_ENDPOINT;
  imgUrl: string = environment.IMG_URL;
  searchQuery: string = '';
  activeCategory: string = 'all';
  isLoading: boolean = false;
  noResults: boolean = false;
  showDropdown: boolean = false;
  suggestions: any[] = [];

  productsPerRow: number = 3;
  pageSize: number = 9;
  private readonly maxSuggestions = 10;

  rawProducts: any[] = [];
  availableCategories: any[] = [];
  allCategories: Category[] = [];
  filteredCategories: Category[] = [];
  private productsLoaded = false;

  get totalProductCount(): number {
    return this.filteredCategories.reduce((sum, cat) => sum + cat.products.length, 0);
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const initialQuery = this.route.snapshot.queryParamMap.get('q')?.trim() ?? '';
    if (initialQuery) {
      this.searchQuery = initialQuery;
      this.activeCategory = 'all';
    }

    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('q')?.trim() ?? '';
      if (query === this.searchQuery) return;

      this.searchQuery = query;
      this.activeCategory = 'all';
      if (this.productsLoaded) {
        this.triggerSearch();
      }
    });

    this.loadProducts();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showDropdown) return;
    const container = this.searchContainer?.nativeElement;
    if (!container) return;

    const target = event.target as Node | null;
    if (target && !container.contains(target)) {
      this.setDropdownOpen(false);
    }
  }

  private setDropdownOpen(open: boolean): void {
    this.showDropdown = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  trackByProductId(index: number, product: any): string | number {
    return product?._id ?? product?.id ?? product?.nom ?? index;
  }

  // Define the screenshot mapping
  private screenshotMapping = [
    {
      label: 'Outfit',
      items: [
        { dbName: 'T-shirt white', displayName: 'T-shirt white' },
        { dbName: 'Hoodie', displayName: 'Hoodie' },
        { dbName: 'hat', displayName: 'Hat' }
      ]
    },
    {
      label: 'Marketing materials',
      items: [
        { dbName: 'Packaging', displayName: 'Packaging' },
        { dbName: 'Bussiness card 1', displayName: 'Business card' },
        { dbName: 'Banner', displayName: 'Banner' }
      ]
    },
    {
      label: 'Personal products',
      items: [
        { dbName: 'Phone case', displayName: 'Phone case' },
        { dbName: 'Notebook', displayName: 'Notebook' },
        { dbName: 'Pen', displayName: 'Pen' }
      ]
    },
    {
      label: 'Events',
      items: [
        { dbName: 'Wedding invitation card', displayName: 'Weeding invitation card' },
        { dbName: 'Brithday invitation card', displayName: 'Birthday invitation card' },
        { dbName: 'poster', displayName: 'Promotional poster' }
      ]
    }
  ];

  loadProducts(): void {
    this.isLoading = true;

    // Fetch categories and products in parallel
    this.http.get<any[]>(`${this.apiUrl}/categorie`).subscribe({
      next: (categories: any[]) => {
        this.availableCategories = categories;
        
        this.http.get<any[]>(`${this.apiUrl}/produit/search`).subscribe({
          next: (products: any[]) => {
            this.rawProducts = products;
            this.applyFilters();
            this.productsLoaded = true;
            this.isLoading = false;
          },
          error: (err: any) => {
            console.error('Failed to load products', err);
            this.isLoading = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Failed to load categories', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.allCategories = [];

    if (this.activeCategory === 'all' && query === '') {
      // "Figma Design" view: use screenshotMapping
      this.screenshotMapping.forEach(mapping => {
        const featured: Product[] = [];
        let resolvedDbCategory = '';

        mapping.items.forEach(item => {
          const found = this.rawProducts.find(p => p.nom.toLowerCase() === item.dbName.toLowerCase());
          if (found) {
            if (!resolvedDbCategory) resolvedDbCategory = found.categorie_nom;
            featured.push({
              name: item.displayName,
              price: found.prixBase,
              image: found.image,
              badge: found.nom.toLowerCase().includes('card') || found.nom.toLowerCase().includes('packaging') || found.nom.toLowerCase().includes('invitation') || found.nom.toLowerCase().includes('poster') ? '100 pièce' : null
            });
          }
        });

        if (featured.length > 0) {
          // Use the actual database category name for functionality, but keep the mapping label for the UI (if needed)
          // Actually, 'See more' needs the DB name to filter correctly in setCategory(name)
          this.allCategories.push(this.buildCategory({ 
            name: resolvedDbCategory || mapping.label, 
            products: featured 
          }));
        }
      });
    } else {
      // "Database Ready" view: show all items belonging to category or matching search
      let filtered = this.rawProducts;
      
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(p => p.categorie_nom === this.activeCategory);
      }
      
      if (query !== '') {
        filtered = filtered.filter(p => p.nom.toLowerCase().includes(query));
      }

      // Group by category to maintain the row structure
      const grouped = new Map<string, Product[]>();
      filtered.forEach(p => {
        const catName = p.categorie_nom || 'Others';
        if (!grouped.has(catName)) grouped.set(catName, []);
        grouped.get(catName)!.push({
          name: p.nom,
          price: p.prixBase,
          image: p.image,
          badge: p.nom.toLowerCase().includes('card') || p.nom.toLowerCase().includes('packaging') ? '100 pièce' : null
        });
      });

      grouped.forEach((prods, name) => {
        this.allCategories.push(this.buildCategory({ name, products: prods }));
      });
    }

    this.filteredCategories = [...this.allCategories];
    this.noResults = this.filteredCategories.length === 0;
  }

  buildCategory(raw: { name: string; products: Product[] }): Category {
    const cat: Category = {
      name: raw.name,
      products: raw.products,
      currentPage: 1,
      totalPages: 1,
      paginatedProducts: []
    };
    this.recalcPagination(cat);
    return cat;
  }

  recalcPagination(cat: Category): void {
    const isSingleView = this.activeCategory === cat.name;
    const size = (isSingleView || this.searchQuery !== '') ? this.pageSize : this.productsPerRow;
    cat.totalPages = Math.ceil(cat.products.length / size);
    cat.currentPage = 1;
    cat.paginatedProducts = cat.products.slice(0, size);
  }

  setCategory(name: string): void {
    this.activeCategory = name;
    this.searchQuery = '';
    this.applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  OnSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      this.suggestions = this.rawProducts
        .filter(p => p.nom.toLowerCase().includes(query))
        .slice(0, this.maxSuggestions);
      this.setDropdownOpen(true);
    } else {
      this.suggestions = [];
      this.setDropdownOpen(false);
    }
  }

  triggerSearch(): void {
    this.setDropdownOpen(false);
    this.activeCategory = 'all';
    this.applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectSuggestion(product: any): void {
    this.searchQuery = product.nom;
    this.setDropdownOpen(false);
    this.triggerSearch();
  }

  closeDropdown(): void {
    this.setDropdownOpen(false);
  }

  prevPage(cat: Category): void {
    if (cat.currentPage > 1) {
      cat.currentPage--;
      this.updatePage(cat);
    }
  }

  nextPage(cat: Category): void {
    if (cat.currentPage < cat.totalPages) {
      cat.currentPage++;
      this.updatePage(cat);
    }
  }

  goToPage(cat: Category, page: number): void {
    cat.currentPage = page;
    this.updatePage(cat);
  }

  updatePage(cat: Category): void {
    const isSingleView = this.activeCategory === cat.name;
    const size = (isSingleView || this.searchQuery !== '') ? this.pageSize : this.productsPerRow;
    const start = (cat.currentPage - 1) * size;
    cat.paginatedProducts = cat.products.slice(start, start + size);
  }

  getPages(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
