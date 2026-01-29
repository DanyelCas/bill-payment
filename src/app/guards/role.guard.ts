import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const requiredRole = route.data['role'] as UserRole;

    if (!authService.isAuthenticated()) {
        return router.createUrlTree(['/login']);
    }

    if (authService.hasRole(requiredRole)) {
        return true;
    }

    // Redirect to appropriate home if role mismatch
    const currentUser = authService.getCurrentUser();
    if (currentUser?.role === UserRole.ADMIN) {
        return router.createUrlTree(['/admin']);
    } else {
        return router.createUrlTree(['/invoices']);
    }
};
