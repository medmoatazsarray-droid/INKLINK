import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Artist {
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
  imports: [],
  templateUrl: './artiste-page.html',
  styleUrl: './artiste-page.css',
})
export class ArtistePage {
  imgUrl : string = 'assets/images';
  artists : Artist[] = [
    {
      name : 'Selima - Sidi Bou Said ',
      image : 'assets/images/artists0.png'
    },
    {
      name : 'Yassine - Kairouan',
      image : 'assets/images/artists1.png'
    },
    {
      name : 'Maya - Sousse',
      image : 'assets/images/artists2.png'
    },
    {
      name : 'Lina - Bizerte',
      image : 'assets/images/artists3.png'
    }
  ];
  tunisianMotifs : Product[] = [
    {
      name : 'A Mug',
      price : '20.00 dt',
      image : 'assets/images/all products/tunisian mug.png'
    },
    {
      name : 'Phone Case',
      price : '15.00 dt',
      image : 'asset/images/all products/phone case.png'
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
  events : Product[] = [
    {
      name : 'Mariage traditionnel',
      price : '980.00 dt',
      image : 'assets/images/traditional marriage.png'
    },
    {
      name : 'Festival culturel',
      price : '900.00 dt',
      image :'assets/images/festival.png'
    },
    {
      name :  'Atelier créatif ',
      price : '500.00 dt',
      image : 'assets/images/atelier.png'
    },
    {
      name  : 'Lancement de startup',
      price : '990.00 dt',
      image : 'assets/images/lancement de startup.png'
    }
  ];

}
