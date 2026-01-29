import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const guestGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.isAuthenticated()) {
        // User is already logged in, redirect to appropriate home
        const currentUser = authService.getCurrentUser();
        if (currentUser?.role === UserRole.ADMIN) {
            return router.createUrlTree(['/admin']);
        } else {
            return router.createUrlTree(['/invoices']);
        }
    }

    // User is not logged in, allow access to login page
    return true;
};
