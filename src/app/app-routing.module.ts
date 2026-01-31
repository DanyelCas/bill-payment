import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Auth
import { LoginComponent } from './components/auth/login/login.component';

// User
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { InvoiceListComponent } from './components/user/invoices/invoice-list/invoice-list.component';

// Admin
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

// Guards
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';
import { UserRole } from './models/user.model';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'invoices',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: UserRole.USER }
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: UserRole.ADMIN }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
