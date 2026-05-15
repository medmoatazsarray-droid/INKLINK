import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
    selectedColor: string = 'black';
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

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.updatePreview();
    }

    onSelectionChange(): void {
        this.updatePreview();
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

        const product = typeToProduct[this.selectedProjectType];
        if (product) {
            this.previewItem.id = product.id;
            this.previewItem.name = product.name;
            this.previewItem.image = product.image;
            this.previewItem.price = product.price;
            this.previewItem.productId = product.productId;
        }
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
            color: this.selectedColor,
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
