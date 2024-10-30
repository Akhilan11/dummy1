import { Component, OnInit } from '@angular/core';

import { ProductsService } from '../../services/products/products.service';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent implements OnInit { 

  products: any = [];
  loading: boolean = true;
  userId: any;


  constructor(private productService: ProductsService,private cartService: CartService,public auth: AuthService,private router : Router) {}

  ngOnInit(): void { 
    this.getProducts();
    this.auth.user$.subscribe(user => {
      if (user) this.userId = user.sub;
    })
    alert(this.userId);
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
      quantity: 1
    };

    this.cartService.createOrUpdateCart(this.userId, [cartItem]).subscribe({
      next: (cart) => alert('Added to cart:'),
      error: (error) => console.log('Failed to add to cart', error)
    });
  }

  viewProduct(id : string) : void {
    this.router.navigate(['/products',id]);
  }
}
