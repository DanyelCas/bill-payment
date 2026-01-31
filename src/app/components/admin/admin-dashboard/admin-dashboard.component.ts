import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TabItem } from '../../shared/ui/tabs/tabs.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  activeTab = 'users';

  tabs: TabItem[] = [
    { id: 'users', label: 'Usuarios', icon: 'users' },
    { id: 'invoices', label: 'Facturas', icon: 'file-text' }
  ];

  constructor(private readonly authService: AuthService) { }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  logout(): void {
    this.authService.logout();
  }
}
