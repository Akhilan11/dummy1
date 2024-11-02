import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '@auth0/auth0-angular';
import { ReviewService } from '../../services/review/review.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  
  product: any;  // Declare product variable
  userId: any;
  quantity: number = 1;  // Default quantity is 1
  selectedSize: string | null = null; // Variable to hold the selected size
  reviews: any[] = []; // Store reviews in a flat array
  newReview = { comment: '', rating: null }; // Initialize newReview object

  constructor(
    private router: ActivatedRoute, 
    private productService: ProductsService, 
    private cartService: CartService, 
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
          this.fetchReviews(this.product._id); // Fetch reviews after fetching the product
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
        this.reviews = fetchedReviews; // Store fetched reviews in the array
        // Mark reviews for the current user as editable
        this.reviews.forEach(review => {
          review.isEditing = false; // Initialize isEditing property
        });
      },
      error: (error) => {
        console.error('Failed to fetch reviews', error);
      }
    });
  }

  submitReview(): void {
    if (this.newReview.comment && this.newReview.rating) {
      const reviewData = {
        productId: this.product._id,
        userId: this.userId,
        comment: this.newReview.comment,
        rating: this.newReview.rating
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (review) => {
          console.log('Review submitted:', review);
          this.reviews.push(review); // Add new review to the list
          this.newReview = { comment: '', rating: null }; // Reset the form
        },
        error: (error) => {
          console.error('Failed to submit review', error);
        }
      });
    }
  }

  editReview(review: any): void {
    review.isEditing = true; // Set editing mode for the review
  }

  submitUpdatedReview(review: any): void {
    const updatedReviewData = {
      comment: review.comment,
      rating: review.rating
    };

    this.reviewService.updateReview(review._id, updatedReviewData).subscribe({
      next: (updatedReview) => {
        console.log('Review updated:', updatedReview);
        review.isEditing = false; // Exit editing mode
      },
      error: (error) => {
        console.error('Failed to update review', error);
      }
    });
  }

  cancelEdit(review: any): void {
    review.isEditing = false; // Cancel editing
  }

  selectSize(size: string): void {
    this.selectedSize = size; // Set the selected size
    console.log(`Selected size: ${this.selectedSize}`);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: any) {
    const cartItem = {
      productId: product._id,
      quantity: this.quantity,
      size: this.selectedSize // Ensure you're passing the selected size here
    };

    // Log cartItem for debugging
    console.log('Cart item to add:', cartItem);

    this.cartService.createOrUpdateCart(this.userId, [cartItem]).subscribe({
      next: (cart) => console.log('Added to cart:', cart),
      error: (error) => {
        console.error('Failed to add to cart', error);
        alert('Failed to add to cart. Please try again later.');
      }
    });
  }
}
