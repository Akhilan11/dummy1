import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ProductsService } from '../../../services/products/products.service';
import { ReviewService } from '../../../services/review/review.service';

@Component({
  selector: 'app-admin-product-detail',
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.css']
})
export class AdminProductDetailComponent {

    product: any;  // Declare product variable
    userId: any;
    reviews: any[] = []; // Store reviews in a flat array

    constructor(
      private router: ActivatedRoute, 
      private productService: ProductsService, 
      private auth: AuthService,
      private reviewService: ReviewService 
    ) {}

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
            this.fetchReviews(this.product._id);
          },
          error: (err: any) => {
            console.error('Error fetching product:', err);
          }
        });
      }
    }

    fetchReviews(productId: string): void {
      this.reviewService.getReviews(productId).subscribe({
        next: (fetchedReviews) => {
          this.reviews = fetchedReviews;
        },
        error: (error) => {
          console.error('Failed to fetch reviews', error);
        }
      });
    }

    deleteReview(review: any): void {
      if (confirm('Are you sure you want to delete this review?')) {
        this.reviewService.deleteReview(review._id).subscribe({
          next: () => {
            console.log('Review deleted:', review._id);
            this.reviews = this.reviews.filter(r => r._id !== review._id); // Update the reviews list
          },
          error: (error) => {
            console.error('Failed to delete review', error);
          }
        });
      }
    }
}
