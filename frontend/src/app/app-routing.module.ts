import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminProductDetailComponent } from './components/admin/admin-product-detail/admin-product-detail.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';

const routes: Routes = [
  { path : '' , component : ProductsComponent },
  { path : 'cart', component : CartComponent },
  { path : 'wishlist/:id' , component : WishlistComponent },
  { path : 'orders/:id' , component : OrdersComponent },
  { path : 'user/:id' , component : UserDashboardComponent },
  { path : 'products/:id' , component : ProductDetailComponent },
  { path : 'admin' , component : AdminHomeComponent },
  { path : 'admin/view-product/:id' , component : AdminProductDetailComponent },
  { path : 'admin/orders' , component : AdminOrdersComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
