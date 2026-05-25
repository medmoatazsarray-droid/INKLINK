import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';

interface PreviewItem {
    id: number;
    name: string;
    image: string;
    price: number;
    productId: number;
}

@Component({
    selector: 'app-ai-generator-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, SearchBar, PartnersComponent],
    templateUrl: './ai-generator-page.html',
    styleUrl: './ai-generator-page.css'
})
export class AiGeneratorPage implements OnInit {
    selectedProjectType: string = 'Personal Branding';
    selectedStyle: string = 'Moderne';
    selectedColors: string[] = ['black'];
    quantity: number = 100;

    projectTypes = [
        { label: 'Personal Branding', value: 'Personal Branding' },
        { label: 'Corporate Identity', value: 'Corporate Identity' },
        { label: 'Event Promotion', value: 'Event Promotion' }
    ];

    styleDirections = [
        { label: 'Traditional', value: 'Traditional' },
        { label: 'Moderne', value: 'Moderne' },
        { label: 'Moderne & Culturel', value: 'Moderne & Culturel' },
        { label: 'Elegant & Pro', value: 'Elegant & Pro' },
        { label :'Creative & Young' , value : 'Creative & Young'},
        { label : 'Minimalist', value : 'Minimalist'}
    ];

    primaryColors = [
        { label: 'Black', hex: '#000000', value: 'black' },
        { label: 'White', hex: '#FFFFFF', value: 'white' },
        { label : 'primary-light', hex : '#E6F2F7' , value : 'primary-light'},
        { label : 'primary', hex :'#2D7C8A' , value : 'primary'},
        { label : 'accent-red' , hex : '#E6371E' , value : 'accent-red'},
        { label : 'beige' , hex : '#C77966' , value : 'beige'},
        { label : 'dark-blue' , hex : '#3A4B5C' , value : 'dark-blue'},
        { label : 'Wine Red' , hex : '#68001A' , value : 'Wine Red'}

    ];

    previewItem: PreviewItem = {
        id: 1,
        name: 'T-shirt',
        image: 'assets/images/all products/t-shirt.png',
        price: 25.00,
        productId: 1
    };

    constructor(private router: Router, private http: HttpClient) { }

    ngOnInit(): void {
        this.updatePreview();
    }

    onSelectionChange(): void {
        this.updatePreview();
    }

    toggleColor(value: string): void {
        const index = this.selectedColors.indexOf(value);
        if (index > -1) {
            if (this.selectedColors.length > 1) {
                this.selectedColors.splice(index, 1);
            }
        } else {
            if (this.selectedColors.length >= 2) {
                this.selectedColors.shift(); // Remove the oldest color
            }
            this.selectedColors.push(value);
        }
        this.onSelectionChange();
    }

    decreaseQty(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    increaseQty(): void {
        this.quantity++;
    }

    private updatePreview(): void {
        const typeToProduct: any = {
            'Personal Branding': { id: 17, name: 'Bussiness card 1', image: 'assets/images/all products/buissnes-card.png', price: 30.0, productId: 17 },
            'Corporate Identity': { id: 16, name: 'Hoodie', image: 'assets/images/all products/hoodie0.png', price: 45.0, productId: 16 },
            'Event Promotion': { id: 24, name: 't-shirt', image: 'assets/images/all products/t-shirt.png', price: 25.0, productId: 24 }
        };

        let defaultProduct = typeToProduct[this.selectedProjectType];
        
        let url = `http://localhost:3001/api/packai/search?project_type=${encodeURIComponent(this.selectedProjectType)}&style=${encodeURIComponent(this.selectedStyle)}`;
        if (this.selectedColors.length > 0) {
            // Find the hex codes corresponding to the selected colors
            const c1 = this.primaryColors.find(c => c.value === this.selectedColors[0]);
            if (c1) url += `&color_primary=${encodeURIComponent(c1.hex)}`;
            
            if (this.selectedColors.length > 1) {
                const c2 = this.primaryColors.find(c => c.value === this.selectedColors[1]);
                if (c2) url += `&color_secondary=${encodeURIComponent(c2.hex)}`;
            }
        }

        this.http.get<any[]>(url).subscribe({
            next: (packs) => {
                if (packs && packs.length > 0) {
                    const pack = packs[0];
                    this.previewItem.id = pack.id_pack || 999;
                    this.previewItem.name = pack.libelle || `${this.selectedProjectType} Kit`;
                    this.previewItem.image = pack.image;
                    this.previewItem.price = 150.0; // Hardcoded default as price isn't in DB
                    
                    // Route to the correct product ID we created in the database for the cart
                    if (pack.id_pack === 13) {
                        this.previewItem.productId = 45;
                    } else {
                        this.previewItem.productId = pack.id_pack || 999;
                    }
                } else if (defaultProduct) {
                    // Fallback to default
                    this.previewItem.id = defaultProduct.id;
                    this.previewItem.name = defaultProduct.name;
                    this.previewItem.image = defaultProduct.image;
                    this.previewItem.price = defaultProduct.price;
                    this.previewItem.productId = defaultProduct.productId;
                }
            },
            error: (err) => {
                console.error('Error fetching pack from db:', err);
                if (defaultProduct) {
                    this.previewItem.id = defaultProduct.id;
                    this.previewItem.name = defaultProduct.name;
                    this.previewItem.image = defaultProduct.image;
                    this.previewItem.price = defaultProduct.price;
                    this.previewItem.productId = defaultProduct.productId;
                }
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/interactive-design']);
    }

    createManually(): void {
        this.router.navigate(['/interactive-design']);
    }

    generateKit(): void {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        const selectionData = {
            projectType: this.selectedProjectType,
            product: this.previewItem.name,
            style: this.selectedStyle,
            color: this.selectedColors.join(', '),
            colors: this.selectedColors,
            quantity: this.quantity,
            preview: this.previewItem
        };

        if (!user || !token || user === 'null' || user === 'undefined') {
            sessionStorage.setItem('pendingKitData', JSON.stringify(selectionData));
            sessionStorage.setItem('redirectUrl', '/kit-preview');
            this.router.navigate(['/login']);
            return;
        }

        console.log('Generating kit with data:', selectionData);
        this.router.navigate(['/kit-preview'], { state: { data: selectionData } });
    }

    
}
