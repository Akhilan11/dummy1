import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  user: any;

  constructor(public auth: AuthService,private router: Router) {}

  ngOnInit() : void {
    this.auth.user$.subscribe(user => {
      this.user = user
    })
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout();
  }

  goToCart(): void {
    this.router.navigate(['/cart']); // Navigates to the cart view
  }

}
