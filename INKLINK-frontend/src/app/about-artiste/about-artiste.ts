import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBar } from '../shared/search-bar/search-bar';
import { PartnersComponent } from '../shared/partners/partners';
import { Footer } from '../shared/footer/footer';

interface Artist {
  name: string;
  role: string;
  image: string;
  username: string;
  email: string;
  phone: string;
  clients: number;
  rating: number;
  reviews: number;
  about: string;
}
interface Collection {
  name: string;
  image: string;
}
interface Product {
  name: string;
  image: string;
  price: number;
}

@Component({
  selector: 'app-about-artiste',
  imports: [CommonModule, RouterModule, SearchBar, PartnersComponent, Footer],
  templateUrl: './about-artiste.html',
  styleUrl: './about-artiste.css',
})
export class AboutArtiste {
  artist: Artist = {
    name: 'Amira',
    role: 'Illustratrice & designer textile',
    image: 'assets/icons/profil2.svg',
    username: 'amira.artist',
    email: 'amira@inklink.com',
    phone: '00.000.000',
    clients: 25,
    rating: 3.0,
    reviews: 10,
    about: 'I\'m Amira, a graduate in visual arts from ENSA Tunis. Since 2023, I\'ve been transforming traditional Tunisian motifs into modern designs—printed locally with vegetable-based inks. My creations are made to last: wash-resistant, eco-friendly, and full of character.',
  };
  collections: Collection[] = [
    {
      name: 'Motifs of Tunisia',
      image: 'assets/images/Motifs of Tunisia.png'
    },
    {
      name: 'Centemporary Illustrations',
      image: 'assets/images/Centemporary Illustrations.png'
    },
    {
      name: 'For Events',
      image: 'assets/images/For Events.png'
    }
  ];
  featuredCreations: Product[] = [
    {
      name: 'T-shirt',
      image: 'assets/images/t-shirts0.png',
      price: 45
    },
    {
      name: 'Hoodie',
      image: 'assets/images/hoodie.png',
      price: 85
    },
    {
      name: 'Business card',
      image: 'assets/images/Businesscard.png',
      price: 20
    },
    {
      name: 'Tote bag',
      image: 'assets/images/Tote bag.png',
      price: 35
    },
    {
      name: 'Notebook',
      image: 'assets/images/Notebook.png',
      price: 15
    },
    {
      name: 'Poster',
      image: 'assets/images/Poster.png',
      price: 25
    }
  ];
  featuredIndex: number = 0;
  visibleCount: number = 4;

  get visibleFeatured(): Product[] {
    return this.featuredCreations.slice(
      this.featuredIndex,
      this.featuredIndex + this.visibleCount
    );
  }
  prevFeatured(): void {
    if (this.featuredIndex > 0) this.featuredIndex--;
  }
  nextFeatured(): void {
    if (this.featuredIndex + this.visibleCount < this.featuredCreations.length) {
      this.featuredIndex++;
    }
  }
}
