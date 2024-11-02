import { Component, OnInit } from '@angular/core';

import { ProductsService } from '../../services/products/products.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit { 

  products: any = [];
  loading: boolean = true;
  userId: any;

  constructor(private productService: ProductsService,public auth: AuthService,private router : Router,private cartService : CartService, private wishlistService : WishlistService) {}

  ngOnInit(): void { 
    this.getProducts();
    this.auth.user$.subscribe(user => {
      if (user) this.userId = user.sub;
    })
    // alert(this.userId);
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (product) => {
        this.products = product;
        this.loading = false;
      },
      error: (error) => { 
        console.log("Failed to fetch products ", error);
        this.loading = false;
      }
    });
  }

  addToCart(product: any): void {
    if (!this.userId) {
      console.log('User must be logged in to add items to the cart');
      return;
    }

    const cartItem = {
      productId: product._id,  // Assuming products have _id field
      quantity: 1,
      // size: product.size // Include size here
      size: "M" // Include size here
    };

    this.cartService.createOrUpdateCart(this.userId, [cartItem]).subscribe({
      next: (cart) => console.log('Added to cart:',cart),
      error: (error) => console.log('Failed to add to cart', error)
    });
  }

  viewProduct(id : string) : void {
    this.router.navigate(['/products',id]);
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
      },
      error: (error: any) => console.log('Failed to add to wishlist', error)
    });
  }

}
