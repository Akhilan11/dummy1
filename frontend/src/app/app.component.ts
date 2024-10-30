import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    // Subscribe to user$ to log the user ID after login
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        console.log('User ID:', user.sub); // `sub` is typically the user ID in Auth0
      }
    });
  }

}
