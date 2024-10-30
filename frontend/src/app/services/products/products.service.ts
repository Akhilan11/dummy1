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
  
}
