import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from '@auth0/auth0-angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductsComponent } from './components/products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminProductDetailComponent } from './components/admin/admin-product-detail/admin-product-detail.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductsComponent,
    CartComponent,
    WishlistComponent,
    OrdersComponent,
    UserDashboardComponent,
    ProductDetailComponent,
    AdminHomeComponent,
    AdminProductsComponent,
    AdminProductDetailComponent,
    AdminOrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'dev-wm1vsarrirmetw32.us.auth0.com',  // Replace this with your Auth0 domain
      clientId: 'bVmLfVakLeON1ooWbemDrPg7zJzmJfIM',  // Replace this with your Auth0 client ID
      authorizationParams: {
        redirect_uri: window.location.origin, // Redirect to your application after login
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
