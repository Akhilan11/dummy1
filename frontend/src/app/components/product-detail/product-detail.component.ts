import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  product: any;  // Declare product variable
  userId : any;

  constructor(private router: ActivatedRoute, private productService: ProductsService, private cartService: CartService, private auth: AuthService) {}

  ngOnInit() {
    this.fetchProduct();
    this.auth.user$.subscribe(user => {
      this.userId = user?.sub;
      console.log(this.userId);
    });
  }

  fetchProduct(): void {
    const id = this.router.snapshot.paramMap.get('id');

    if (id) {
      this.productService.getProductbyId(id).subscribe({
        next: (product) => {
          this.product = product;  
          console.log('Fetched Product:', this.product._id);
        },
        error: (err : any) => {
          console.error('Error fetching product:', err);
        }
      });
    }
  }

  // addToCart(): void {
  //   if (this.user) {
  //     const userId = this.user.sub; // Assuming Auth0 user info
  //     const productId = this.product?._id; // Use optional chaining here
  //     if (productId) {
  //       this.cartService.createOrUpdateCart(userId, productId).subscribe({
  //         next: () => alert('Product added to cart!'),
  //         error: (err : any) => console.error('Error adding product to cart:', err)
  //       });
  //     } else {
  //       alert('Product ID is undefined.');
  //     }
  //   } else {
  //     alert('Please log in to add items to the cart');
  //   }
  // }

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

}
