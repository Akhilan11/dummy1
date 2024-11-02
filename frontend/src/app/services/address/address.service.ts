import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'http://localhost:3500/api/address'; // Adjust the URL to your backend endpoint

  constructor(private http: HttpClient) {}

  // Method to create a new address
  createAddress(addressData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, addressData);
  }

  // Optional: Method to retrieve addresses for a user
  getAddresses(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?userId=${userId}`);
  }

  // Optional: Method to delete an address
  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${addressId}`);
  }

  // Optional: Method to update an address
  updateAddress(addressId: string, addressData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${addressId}`, addressData);
  }
}
