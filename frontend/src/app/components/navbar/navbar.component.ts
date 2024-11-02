import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: any; // You can define a more specific type if needed
  isDropdownOpen = false; // Control dropdown visibility

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
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

  goToUserDashboard(): void {
    this.router.navigate([`/user/${this.user.sub}`]);
  }

  goToWishlist(): void {
    if (this.user) {
      this.router.navigate(['/wishlist', this.user.sub]); // Pass userId as a parameter
    } else {
      console.log('User is not logged in or user information is not available');
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle dropdown visibility
  }
}
