import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3500/api/reviews'; // Directly specify the API URL

  constructor(private http: HttpClient) {}

  // Create a new review
  createReview(review: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, review);
  }

  // Get all reviews for a specific product
  getReviews(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}`);
  }

  // Update a review
  updateReview(id: string, review: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, review, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Delete a review
  deleteReview(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
