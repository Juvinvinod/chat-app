import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() logoutButton!: boolean;

  constructor(private _router: Router) {}

  logOut(): void {
    localStorage.removeItem('user');
    this._router.navigate(['../']);
  }
}
