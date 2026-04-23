import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { NavbarCom } from "../shared/navbar-com/navbar-com";
import { SearchBar } from "../shared/search-bar/search-bar";
import { PartnersComponent } from "../shared/partners/partners";
 
@Component({
    selector: "app-interactive-design",
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarCom, SearchBar, PartnersComponent],
    templateUrl: "./interactive-design.html",
    styleUrls: ["./interactive-design.css"],
})

export class InteractiveDesignPage  {
    constructor(private router : Router) {}
    goToLogo() : void {
      this.router.navigate(['/workshop/logo']);
    }
    goToCarte() : void {
      this.router.navigate(['/workshop/carte/viste']);
    }
    goToAffiche() : void {
      this.router.navigate(['/workshop/affiche']);
    }
    goToTshirt(): void {
      this.router.navigate(['/workshop/tshirt']);
    }
}