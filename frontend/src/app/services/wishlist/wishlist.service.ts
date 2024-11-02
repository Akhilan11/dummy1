import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  
  private url = "http://localhost:3500/api/wishlist";

  constructor(private http: HttpClient) {}

  // Create or update wishlist for a user
  createOrUpdateWishlist(userId: string, items: any[]): Observable<any> {
    return this.http.post(`${this.url}`, { userId,items });
  }

  // Fetch wishlist for a user
  getWishlist(userId: string): Observable<any> {
    return this.http.get(`${this.url}/${userId}`);
  }

  // Remove an item from the wishlist
  removeFromWishlist(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.url}/${userId}/items/${productId}`);
  }
}
