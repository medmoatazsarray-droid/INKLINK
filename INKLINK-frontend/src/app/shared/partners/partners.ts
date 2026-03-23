import { Component } from '@angular/core';

@Component({
  selector: 'app-partners',
  imports: [],
  templateUrl: './partners.html',
  styleUrl: './partners.css',
})
export class PartnersComponent {
    partners = [
      {name : 'zaytouna' , logo : 'zaytouna logo'},
      {name : 'petit', logo : 'petit logo'},
      {name : 'al manar', logo :"al manar logo"},
      {name : 'tree', logo :"tree img"},
      {name : 'zitouna', logo :"zitouna logo"},
      {name : 'bio tunis', logo :"bio tunis logo"},
      {name : 'sg', logo :"sg img"},
      {name : 'cafe', logo :"cafe img"},
      {name : 'festival', logo :"festival img"},
    ];
}
