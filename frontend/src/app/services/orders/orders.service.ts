import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:3500/api/orders';  

  constructor(private http: HttpClient) {}

  // Place a new order
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, orderData);
  }

  // Get all orders for a specific user
  getUserOrders(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Get all orders for a specific user
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get a specific order by ID
  getOrderById(userId: any, orderId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/${orderId}`);
  }

  // Update order status
  updateOrderStatus(orderId: any, status: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}`, { status });
  }

}
