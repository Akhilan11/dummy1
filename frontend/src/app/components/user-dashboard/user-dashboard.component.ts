import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'] // Corrected from styleUrl to styleUrls
})
export class UserDashboardComponent implements OnInit {

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
