import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    userForm: FormGroup;
    adminForm: FormGroup;
    isAdminMode = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService
    ) {
        this.userForm = this.fb.group({
            customerId: ['', [
                Validators.required,
                Validators.pattern(/^\d{6,10}$/)
            ]]
        });

        this.adminForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    toggleMode(): void {
        this.isAdminMode = !this.isAdminMode;
        this.userForm.reset();
        this.adminForm.reset();
    }

    onUserLogin(): void {
        if (this.userForm.valid) {
            const { customerId } = this.userForm.value;
            if (!this.authService.loginUser(customerId)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: 'ID de cliente inválido. Por favor, verifique.'
                });
            }
        }
    }

    onAdminLogin(): void {
        if (this.adminForm.valid) {
            const { username, password } = this.adminForm.value;
            if (!this.authService.loginAdmin(username, password)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: 'Credenciales de administrador incorrectas.'
                });
            }
        }
    }
}
