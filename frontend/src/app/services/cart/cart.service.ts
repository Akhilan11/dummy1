// src/app/services/cart/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3500/api/carts'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createOrUpdateCart(userId: string, items: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { userId, items });
  }

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateItemQuantity(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/items/${productId}`, { quantity });
  }

  removeItem(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/items/${productId}`);
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
 

}
