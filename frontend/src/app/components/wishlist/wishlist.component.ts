import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html', // Your HTML file
  styleUrls: ['./wishlist.component.css'] // Your CSS file
})
export class WishlistComponent implements OnInit {
  userId: any; // Specify the type to be more precise
  wishlist: any[] = []; // Define the type according to your wishlist structure
  loading: boolean = true; // Initialize loading state

  constructor(
    private auth: AuthService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Subscribe to user information to get userId
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.sub; // Assign userId from Auth0
        this.getWishlist(); // Fetch wishlist items when userId is available
      } else {
        this.loading = false; // If no user, stop loading
      }
    });
  }

  getWishlist(): void {
    if (!this.userId) {
      this.loading = false; // Stop loading if no userId
      return;
    }

    this.wishlistService.getWishlist(this.userId).subscribe({
      next: (response: any) => {
        this.wishlist = response.items; // Adjust according to your API response structure
        this.loading = false; // Stop loading after fetching
      },
      error: (error: any) => {
        console.log('Failed to fetch wishlist', error);
        this.loading = false; // Stop loading on error
      }
    });
  }

  addToWishlist(productId: string): void {
    if (!this.userId) {
      console.log('User must be logged in to add items to the wishlist');
      return;
    }

    // Create a wishlist item to be added
    const wishlistItem = { productId };

    // Create or update the wishlist for the user
    this.wishlistService.createOrUpdateWishlist(this.userId, [wishlistItem]).subscribe({
      next: (response: any) => {
        console.log('Added to wishlist:', response);
        this.getWishlist(); // Refresh the wishlist after adding
      },
      error: (error: any) => console.log('Failed to add to wishlist', error)
    });
  }

  removeFromWishlist(productId: string): void {
    if (!this.userId) {
      console.log('User must be logged in to remove items from the wishlist');
      return;
    }

    // Remove an item from the wishlist
    this.wishlistService.removeFromWishlist(this.userId, productId).subscribe({
      next: (response: any) => {
        console.log('Removed from wishlist:', response);
        this.getWishlist(); // Refresh the wishlist after removing
      },
      error: (error: any) => console.log('Failed to remove from wishlist', error)
    });
  }
}
