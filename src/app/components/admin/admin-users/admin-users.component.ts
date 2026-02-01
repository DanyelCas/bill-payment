import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { InvoiceService } from '../../../services/invoice.service';
import { User, UserRole } from '../../../models/user.model';
import { TableColumn } from '../../shared/ui/table/table.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];
    userForm: FormGroup;
    showModal = false;
    isEditing = false;
    isLoading = false;
    searchTerm = '';
    private originalUser: any = null;

    get filteredUsers(): User[] {
        if (!this.searchTerm.trim()) {
            return this.users;
        }

        const term = this.searchTerm.toLowerCase().trim();
        return this.users.filter(user =>
            user.id.toLowerCase().includes(term) ||
            user.name.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
        );
    }

    columns: TableColumn[] = [
        { key: 'id', header: 'ID', classes: 'id-cell' },
        { key: 'name', header: 'Nombre', classes: 'font-medium' },
        { key: 'email', header: 'Email' },
        { key: 'status', header: 'Estado' },
        { key: 'actions', header: 'Acciones', classes: 'text-right' }
    ];

    constructor(
        private readonly userService: UserService,
        private readonly invoiceService: InvoiceService,
        private readonly fb: FormBuilder
    ) {
        this.userForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            username: [''] // Optional, for admin identification if needed, but not primary login
        });
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading users', err);
                this.isLoading = false;
            }
        });
    }

    openAddModal(): void {
        this.isEditing = false;
        this.userForm.reset();
        this.showModal = true;
    }

    openEditModal(user: User): void {
        this.isEditing = true;
        this.originalUser = {
            id: user.id,
            name: user.name,
            email: user.email || ''
        };
        this.userForm.patchValue(this.originalUser);
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.userForm.reset();
        this.originalUser = null;
    }

    onSubmit(): void {
        if (this.userForm.invalid) return;

        const formValue = this.userForm.value;

        if (this.isEditing) {
            // Check if anything changed (ignoring surrounding whitespace)
            const hasChanges = Object.keys(this.originalUser).some(key => {
                const val1 = this.originalUser[key];
                const val2 = formValue[key];
                if (typeof val1 === 'string' && typeof val2 === 'string') {
                    return val1.trim() !== val2.trim();
                }
                return val1 !== val2;
            });

            if (!hasChanges) {
                Swal.fire({
                    title: 'Sin cambios',
                    text: 'No has realizado ninguna modificación para actualizar.',
                    icon: 'info',
                    confirmButtonText: 'Entendido',
                    customClass: {
                        confirmButton: 'swal2-confirm-primary',
                        popup: 'swal2-rounded-lg'
                    }
                });
                return;
            }
        }

        this.isLoading = true;
        const userData: User = {
            ...formValue,
            role: UserRole.USER, // Defaults to USER
            status: 'active' // New users start as active
        };

        if (this.isEditing) {
            Swal.fire({
                title: '¿Confirmar cambios?',
                text: "¿Estás seguro de que deseas actualizar la información de este usuario?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'swal2-confirm-primary',
                    cancelButton: 'swal2-cancel-gray',
                    popup: 'swal2-rounded-lg'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.isLoading = true;
                    this.userService.updateUser(userData).subscribe({
                        next: () => {
                            this.loadUsers();
                            this.closeModal();
                            Swal.fire({
                                title: '¡Actualizado!',
                                text: 'El usuario ha sido actualizado correctamente.',
                                icon: 'success',
                                confirmButtonText: 'Aceptar',
                                customClass: {
                                    confirmButton: 'swal2-confirm-success',
                                    popup: 'swal2-rounded-lg'
                                }
                            });
                        },
                        error: (err) => {
                            console.error('Error updating user', err);
                            this.isLoading = false;
                        }
                    });
                } else {
                    this.isLoading = false;
                }
            });
        } else {
            // Generate ID
            // Simple logic: max ID + 1. IDs are strings "100001".
            const maxId = this.users.reduce((max, u) => {
                const id = Number.parseInt(u.id, 10);
                return Number.isNaN(id) ? max : Math.max(max, id);
            }, 100000);
            userData.id = (maxId + 1).toString();

            this.userService.createUser(userData).subscribe({
                next: () => {
                    this.loadUsers();
                    this.closeModal();
                    Swal.fire({
                        title: '¡Creado!',
                        text: 'El usuario ha sido registrado correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            confirmButton: 'swal2-confirm-success',
                            popup: 'swal2-rounded-lg'
                        }
                    });
                },
                error: (err) => {
                    console.error('Error creating user', err);
                    this.isLoading = false;
                }
            });
        }
    }

    toggleUserStatus(user: User): void {
        if (user.status === 'inactive') {
            // Re-activating is always allowed
            this.updateStatus(user, 'active');
            return;
        }

        // Check for debts before inactivating
        this.isLoading = true;
        this.invoiceService.getInvoices(user.id).subscribe({
            next: (invoices) => {
                const today = new Date().toISOString().split('T')[0];
                const pendingInvoices = invoices.filter(inv => inv.estado === 'pendiente');
                const overdueInvoices = pendingInvoices.filter(inv => inv.fechaVencimiento < today);

                this.isLoading = false;

                if (overdueInvoices.length > 0) {
                    Swal.fire({
                        title: 'Inactivación bloqueada',
                        html: `
                            <div style="text-align: left;">
                                <p>No se puede inactivar al usuario <strong>${user.name}</strong> porque tiene <strong>${overdueInvoices.length} facturas vencidas</strong>.</p>
                                <p style="margin-top: 10px; color: #e53e3e; font-weight: 500;">Debe regularizar sus deudas antes de ser inactivado.</p>
                            </div>
                        `,
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                        customClass: {
                            confirmButton: 'swal2-confirm-primary',
                            popup: 'swal2-rounded-lg'
                        }
                    });
                    return;
                }

                if (pendingInvoices.length > 0) {
                    Swal.fire({
                        title: 'Aviso de deudas pendientes',
                        text: `El usuario tiene ${pendingInvoices.length} facturas pendientes (no vencidas). ¿Deseas inactivarlo de todas formas?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, inactivar',
                        cancelButtonText: 'Cancelar',
                        customClass: {
                            confirmButton: 'swal2-confirm-primary',
                            cancelButton: 'swal2-cancel-gray',
                            popup: 'swal2-rounded-lg'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.updateStatus(user, 'inactive');
                        }
                    });
                    return;
                }

                // No pending debts, just confirm inactivation
                Swal.fire({
                    title: '¿Confirmar inactivación?',
                    text: `¿Estás seguro de que deseas inactivar al usuario ${user.name}?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, inactivar',
                    cancelButtonText: 'Cancelar',
                    customClass: {
                        confirmButton: 'swal2-confirm-primary',
                        cancelButton: 'swal2-cancel-gray',
                        popup: 'swal2-rounded-lg'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.updateStatus(user, 'inactive');
                    }
                });
            },
            error: (err) => {
                console.error('Error checking debts', err);
                this.isLoading = false;
            }
        });
    }

    private updateStatus(user: User, status: 'active' | 'inactive'): void {
        this.isLoading = true;
        const updatedUser = { ...user, status };
        this.userService.updateUser(updatedUser).subscribe({
            next: () => {
                this.loadUsers();
                Swal.fire({
                    title: status === 'active' ? '¡Usuario Activado!' : '¡Usuario Inactivado!',
                    text: `El estado del usuario ha sido actualizado a ${status === 'active' ? 'activo' : 'inactivo'}.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        confirmButton: 'swal2-confirm-success',
                        popup: 'swal2-rounded-lg'
                    }
                });
            },
            error: (err) => {
                console.error('Error updating status', err);
                this.isLoading = false;
            }
        });
    }

    deleteUser(id: string): void {
        // Keep for now or remove if strictly forbidden. User said "no se pueda eliminar".
        // I'll comment it out or just remove from UI.
    }
}
