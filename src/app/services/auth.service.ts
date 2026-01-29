import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly ADMIN_MOCK = {
        username: 'admin',
        password: 'password123'
    };

    constructor(private readonly router: Router) {
        this.loadSession();
    }

    private loadSession(): void {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUserSubject.next(JSON.parse(savedUser));
            } catch (e) {
                console.error('Error loading session', e);
                this.logout();
            }
        }
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    loginUser(customerId: string): boolean {
        // Basic validation for customerId (e.g. 6-10 digits)
        if (!/^\d{6,10}$/.test(customerId)) {
            return false;
        }

        const user: User = {
            id: customerId,
            name: `Cliente ${customerId}`,
            role: UserRole.USER
        };

        this.setSession(user);
        return true;
    }

    loginAdmin(username: string, password: string): boolean {
        if (username === this.ADMIN_MOCK.username && password === this.ADMIN_MOCK.password) {
            const user: User = {
                id: 'admin-001',
                name: 'Administrador del Sistema',
                username: username,
                role: UserRole.ADMIN
            };
            this.setSession(user);
            return true;
        }
        return false;
    }

    private setSession(user: User): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        // Redirect based on role
        if (user.role === UserRole.ADMIN) {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/invoices']);
        }
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    hasRole(role: UserRole): boolean {
        return this.currentUserSubject.value?.role === role;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
