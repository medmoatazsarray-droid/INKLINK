import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-siderbar',
  imports: [RouterLink],
  templateUrl: './siderbar.html',
  styleUrl: './siderbar.css',
})
export class Siderbar {
  @Input() adminName = 'Admin';
}
