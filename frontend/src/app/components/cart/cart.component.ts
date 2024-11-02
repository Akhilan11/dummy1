// src/app/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular'; // Import AuthService from Auth0
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userId: any; // Set this based on your authentication logic
  cart: any = { items: [] };
  loading: boolean = true;

  fullName: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  city: string = '';
  state: string = '';
  postalCode: string = '';
  country: string = '';
  phone: string = '';

  displayModal: boolean = false;

  constructor(private cartService: CartService, private auth: AuthService,private router: Router) {} // Inject AuthService

  ngOnInit(): void {
    // Fetch user ID from Auth0
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.sub; // Use user.sub as user ID
        this.loadCart(); // Load the cart after setting userId
      }
    });
  }

  loadCart(): void {
    if (!this.userId) return; // Prevent loading cart if userId is not available
    this.cartService.getCart(this.userId).subscribe(
      (data) => {
        this.cart = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    );
  }

  increaseQuantity(productId: string, currentQuantity: number): void {
    this.cartService.updateItemQuantity(this.userId, productId, currentQuantity + 1).subscribe(
      (updatedCart) => {
        this.cart = updatedCart;
        this.loadCart();
      },
      (error) => {
        console.error('Error increasing quantity:', error);
      }
    );
  }

  decreaseQuantity(productId: string, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.cartService.updateItemQuantity(this.userId, productId, currentQuantity - 1).subscribe(
        (updatedCart) => {
          this.cart = updatedCart;
          this.loadCart();
        },
        (error) => {
          console.error('Error decreasing quantity:', error);
        }
      );
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(this.userId, productId).subscribe(
      (updatedCart) => {
        this.cart = updatedCart;
        this.loadCart();
      },
      (error) => {
        console.error('Error removing item:', error);
      }
    );
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe(
      () => {
        this.cart.items = [];
        this.loadCart();
      },
      (error) => {
        console.error('Error clearing cart:', error);
      }
    );
  }

  // Method to calculate the total purchase amount
  getTotalPurchase(): number {
    return this.cart?.items?.reduce((total: number, item: any) => {
      return total + (item?.productId?.price || 0) * (item?.quantity || 0);
    }, 0) || 0;
  }

  confirmOrder() {
    // Handle the order confirmation logic here
    alert("Order confirmed!");
  }

  openModal() {
    this.displayModal = true;  // Set displayModal to true to show modal
  }
  
  onCloseHandled() {
    this.displayModal = false;  // Set displayModal to false to hide modal
  }

  onSubmit() {
    // Handle form submission, e.g., send data to the backend
    console.log("Form submitted:", {
      userId: this.userId,
      fullName: this.fullName,
      addressLine1: this.addressLine1,
      addressLine2: this.addressLine2,
      city: this.city,
      state: this.state,
      postalCode: this.postalCode,
      country: this.country,
      phone: this.phone
    });
    alert("Details saved successfully!");
  }

  goToOrders() {
    this.router.navigate([`/orders/${this.userId}`]);
  }
}
