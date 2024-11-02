import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CartService } from '../../services/cart/cart.service';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'] // Corrected property name from 'styleUrl' to 'styleUrls'
})
export class OrdersComponent {
  userId: any; // Set this based on your authentication logic
  cart: any = { items: [] };
  loading: boolean = true;
  orderData : any;

  fullName: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  city: string = '';
  state: string = '';
  postalCode: string = '';
  country: string = '';
  phone: string = '';

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private ordersService: OrdersService
  ) {}

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

  onSubmit() {
    // Validate required address fields
    if (!this.fullName || !this.addressLine1 || !this.city || !this.state || !this.postalCode || !this.country || !this.phone) {
      alert('Please fill in all required address fields.');
      return;
    }

    // Prepare order data with correct format for items array
    this.orderData = {
      userId: this.userId,
      items: this.cart.items.map((item: any) => ({
        productId: item.productId._id || item.productId, // Ensure productId is in correct format
        quantity: item.quantity,
        price: item.productId.price, // Assuming price comes from product data
        size: item.size // Ensure size is included and valid
      })),
      totalAmount: this.getTotalPurchase(), // Calculate total amount using getTotalPurchase()
      address: {
        fullName: this.fullName,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2, // Optional
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country,
        phone: this.phone
      },
      status: 'pending', // Default order status
      createdAt: new Date().toISOString() // Timestamp for order creation
    };

    console.log('Order data being sent:', JSON.stringify(this.orderData, null, 2)); // Log for debugging

    // Place order by calling the OrdersService
    this.ordersService.placeOrder(this.orderData).subscribe(
      response => {
        console.log('Order submitted successfully:', response);
        alert('Order placed successfully!');
        // this.router.navigate(['/thank-you']); // Navigate to confirmation page
      },
      error => {
        console.error('Error submitting order:', error);
        alert('Error placing order. Please try again.');
      }
    );
  }

  getTotalPurchase(): number {
    return this.cart?.items?.reduce((total: number, item: any) => {
      return total + (item?.productId?.price || 0) * (item?.quantity || 0);
    }, 0) || 0;
  }
}
