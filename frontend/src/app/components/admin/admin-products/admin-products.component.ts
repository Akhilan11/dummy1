import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ProductsService } from '../../../services/products/products.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})

export class AdminProductsComponent {
  products: any[] = [];
  loading: boolean = true;
  isEditing: boolean = false; // Track if a product is in edit mode
  currentEditProduct: any = null; // Track the product being edited

  constructor(private productService: ProductsService, public auth: AuthService, private router: Router) {}

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => { 
        console.log("Failed to fetch products", error);
        this.loading = false;
      }
    });
  }

  startEditing(product: any): void {
    this.isEditing = true;
    this.currentEditProduct = { ...product }; // Clone the product data to avoid direct mutation
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.currentEditProduct = null;
  }

  viewProduct(id : string) : void {
    this.router.navigate(['/admin/view-product/:id',id]);
  }    

  saveProduct(): void {
    if (!this.currentEditProduct) return;

    this.productService.updateProduct(this.currentEditProduct._id, this.currentEditProduct).subscribe({
      next: () => {
        this.isEditing = false;
        this.getProducts(); // Refresh the product list after update
      },
      error: (error) => console.log("Failed to update product", error)
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(product => product._id !== productId);
        },
        error: (error) => console.log("Failed to delete product", error)
      });
    }
  }
}
