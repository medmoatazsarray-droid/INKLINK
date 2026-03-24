import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.html',
  styleUrl: './partners.css',
})
export class PartnersComponent {
    partners = [
      {name : 'zaytouna' , logo : 'zaytouna logo.png'},
      {name : 'petit', logo : 'petit logo.png'},
      {name : 'al manar', logo :"al manar logo.png"},
      {name : 'tree', logo :"tree img.png"},
      {name : 'zitouna', logo :"zitouna logo.png"},
      {name : 'bio tunis', logo :"bio tunis logo.png"},
      {name : 'sg', logo :"sg img.png"},
      {name : 'cafe', logo :"cafe img.png"},
      {name : 'festival', logo :"festival img.jpg"},
    ];
}
