import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarCom } from '../shared/navbar-com/navbar-com';
import { SearchBar } from '../shared/search-bar/search-bar';

interface Artist {
  id?: number;
  name : string;
  image : string;
}
interface Product {
  name : string;
  price : string | number;
  image : string;
  badge? : string;
}
@Component({
  selector: 'app-artiste-page',
  imports: [CommonModule, RouterModule, NavbarCom, SearchBar],
  templateUrl: './artiste-page.html',
  styleUrl: './artiste-page.css',
})
export class ArtistePage implements OnInit, AfterViewInit {
  imgUrl : string = '';
  artists : Artist[] = [];

  constructor(private http: HttpClient, private el: ElementRef) {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1
    });

    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((el: HTMLElement) => observer.observe(el));
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3001/api/artiste').subscribe({
      next: (data) => {
        this.artists = data.map(a => ({
          id: a.id_artiste ?? a.id,
          name: a.nom,
          image: a.image ? (a.image.startsWith('http') ? a.image : 'http://localhost:3001' + (a.image.startsWith('/') ? '' : '/') + a.image) : 'assets/images/artists0.png'
        }));
      },
      error: (err) => {
        console.error('Error fetching artistes:', err);
      }
    });

    this.http.get<any[]>('http://localhost:3001/api/produit').subscribe({
      next: (data) => {
        this.events = data
          .filter(p => p.categorie_nom && p.categorie_nom.toLowerCase().includes('event'))
          .map(p => ({
            name: p.nom,
            price: p.prixBase + ' dt',
            image: p.image ? (p.image.startsWith('http') ? p.image : 'http://localhost:3001' + (p.image.startsWith('/') ? '' : '/') + p.image) : 'assets/images/placeholder.svg'
          }));
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }
  tunisianMotifs : Product[] = [
    {
      name : 'A Mug',
      price : '20.00 dt',
      image : 'assets/images/all products/tunisian mug.png'
    },
    {
      name : 'Phone Case',
      price : '15.00 dt',
      image : 'assets/images/all products/phone case.png'
    },
    {
      name : 'A Pen',
      price : '15.00 dt',
      image : 'assets/images/all products/pen.png'
    },
    {
      name : 'Notebook',
      price : '20.00 dt',
      image : 'assets/images/all products/nootbook1.png'
    }
  ];
  events : Product[] = [];

}
