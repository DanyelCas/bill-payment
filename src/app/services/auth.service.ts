import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

    constructor(
        private readonly router: Router,
        private readonly http: HttpClient
    ) {
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

    login(id: string): Observable<boolean> {
        // Admin check
        if (id === 'ADMIN') {
            const adminUser: User = {
                id: 'ADMIN',
                name: 'Administrador',
                role: UserRole.ADMIN,
                status: 'active'
            };
            this.setSession(adminUser);
            return of(true);
        }

        // User check via API
        return this.http.get<User[]>(`http://localhost:3000/users?id=${id}`).pipe(
            map((users: User[]) => {
                if (users.length > 0) {
                    const userFromApi = users[0];
                    const user: User = {
                        id: userFromApi.id.toString(), // Ensure string
                        name: userFromApi.name,
                        role: UserRole.USER,
                        status: userFromApi.status || 'active'
                    };
                    this.setSession(user);
                    return true;
                }
                return false;
            }),
            catchError(error => {
                console.error('Login error', error);
                return of(false);
            })
        );
    }

    loginAdmin(username: string, password: string): Observable<boolean> {
        if (username === this.ADMIN_MOCK.username && password === this.ADMIN_MOCK.password) {
            const adminUser: User = {
                id: 'ADMIN',
                name: 'Administrador',
                role: UserRole.ADMIN,
                status: 'active'
            };
            this.setSession(adminUser);
            return of(true);
        }
        return of(false);
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
