import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  private url = "http://localhost:3500/api/products";

  constructor(private http : HttpClient) { }

  getProducts() : Observable<any> {
      return this.http.get(this.url);
  }

  getProductbyId(productId : any) :  Observable<any> {
      return this.http.get(`${this.url}/${productId}`);
  } 

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.url, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
  
}
