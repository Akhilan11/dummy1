import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ProductsService } from '../../../services/products/products.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  loading: boolean = true;
  isEditing: boolean = false;
  currentEditProduct: any = null;

  product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    gender: '',
    imageUrls: [] as string[]
  };

  imageFiles: File[] = []; // Array to hold selected image files

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
    this.currentEditProduct = { ...product };
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.currentEditProduct = null;
  }

  viewProduct(id: string): void {
    this.router.navigate([`/admin/view-product/${id}`]);
  }    

  saveProduct(): void {
    if (!this.currentEditProduct) return;

    this.productService.updateProduct(this.currentEditProduct._id, this.currentEditProduct).subscribe({
      next: () => {
        this.isEditing = false;
        this.getProducts();
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

  async onSubmit(): Promise<void> {
    // Assuming the files are ready to be uploaded directly without compression
    const base64Images: string[] = [];

    for (const file of this.imageFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        base64Images.push(reader.result as string); // Convert file to base64
      };
      reader.readAsDataURL(file); // Convert file to base64
    }

    // Wait for all files to be read
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (base64Images.length === this.imageFiles.length) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });

    this.product.imageUrls = base64Images;

    this.productService.createProduct(this.product).subscribe({
      next: () => {
        alert('Product added successfully');
        this.getProducts();
        this.resetForm();
      },
      error: (error) => {
        console.error("Failed to add product", error);
        alert("Failed to add product. Please try again.");
      }
    });
  }

  resetForm(): void {
    this.product = {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      gender: '',
      imageUrls: []
    };
    this.imageFiles = []; // Reset the image files
  }

  onFileSelected(event: any): void {
    this.imageFiles = Array.from(event.target.files); // Store the selected files
    this.product.imageUrls = []; // Clear previous image URLs
    for (const file of this.imageFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.imageUrls.push(e.target.result); // Preview the image
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  }
}
