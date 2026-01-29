import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Bill Payment';

  constructor(public readonly authService: AuthService) { }

  onLogout(): void {
    this.authService.logout();
  }
}
