import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CartService } from '../../../services/cart/cart.service';
import { OrdersService } from '../../../services/orders/orders.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent {

  userId: any; // Adjusted type to any to accommodate user object
  orders: any[] = []; // Array to hold the user's orders
  loading: boolean = true; // Loading state for orders
  error: string | null = null; // Error message variable

  constructor(private auth: AuthService, private ordersService: OrdersService) {}

  ngOnInit(): void {
    // Fetch user ID from Auth0
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user; // Set user object
        this.fetchUserOrders(); // Load orders after setting userId
      }
    });
  }

  fetchUserOrders(): void {
    if (!this.userId) return; // Ensure userId is available

    this.ordersService.getUserOrders(this.userId.sub).subscribe(
      (data) => {
        this.orders = data; // Assign the fetched orders to `orders`
        this.loading = false; // Update loading state
      },
      (error) => {
        console.error('Error fetching user orders:', error);
        this.error = 'Failed to load your orders. Please try again later.'; // Set error message
        this.loading = false; // Update loading state
      }
    );
  }


}
  
