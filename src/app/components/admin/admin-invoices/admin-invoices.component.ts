import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice.service';
import { UserService } from '../../../services/user.service';
import { Invoice } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { TableColumn } from '../../shared/ui/table/table.component';
import { DropdownOption } from '../../shared/ui/multi-select-dropdown/multi-select-dropdown.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-admin-invoices',
    templateUrl: './admin-invoices.component.html',
    styleUrls: ['./admin-invoices.component.scss']
})
export class AdminInvoicesComponent implements OnInit {
    invoices: Invoice[] = [];
    users: User[] = [];
    servicesList: string[] = ['Internet Fibra', 'TV Cable', 'Telefonía Fija', 'Gas Domiciliario', 'Luz Eléctrica', 'Agua Potable'];

    invoiceForm: FormGroup;
    showModal = false;
    isEditing = false;
    currentEditingId: number | null = null;
    isLoading = false;
    private originalInvoice: any = null;

    // Search filters
    searchFilters = {
        customerName: '',
        customerId: '',
        servicios: new Set<string>(),
        meses: new Set<string>(),
        anios: new Set<string>(),
        estados: new Set<string>()
    };

    // Form selections for multi-select dropdowns (single mode)
    selectedFormCustomer = new Set<string>();
    selectedFormService = new Set<string>();
    selectedFormMonth = new Set<string>();
    selectedFormYear = new Set<string>();

    // Options for selects
    serviceOptions: DropdownOption[] = this.servicesList.map(s => ({ value: s, label: s }));

    statusOptions: DropdownOption[] = [
        { value: 'pendiente', label: 'Pendiente', badgeClass: 'badge-pending' },
        { value: 'pagado', label: 'Pagado', badgeClass: 'badge-paid' },
        { value: 'vencido', label: 'Vencido', badgeClass: 'badge-overdue' }
    ];

    monthOptions: DropdownOption[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        .map(m => ({ value: m, label: m }));



    yearOptions: DropdownOption[] = [];

    // Options for customer select
    customerOptions: DropdownOption[] = [];

    get filteredInvoices(): Invoice[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.invoices.filter(invoice => {
            const customerIdMatch = !this.searchFilters.customerId.trim() ||
                (invoice.customerId && invoice.customerId.toString().toLowerCase().trim().includes(this.searchFilters.customerId.toLowerCase().trim()));

            const customerNameMatch = !this.searchFilters.customerName.trim() ||
                this.getUserName(invoice.customerId).toLowerCase().includes(this.searchFilters.customerName.toLowerCase().trim());

            const serviciosMatch = this.searchFilters.servicios.size === 0 ||
                this.searchFilters.servicios.has(invoice.servicio);

            const mesesMatch = this.searchFilters.meses.size === 0 ||
                this.searchFilters.meses.has(invoice.mes);

            const aniosMatch = this.searchFilters.anios.size === 0 ||
                this.searchFilters.anios.has(invoice.anio.toString());

            let estadosMatch = this.searchFilters.estados.size === 0;
            if (!estadosMatch) {
                const isOverdue = this.isInvoiceOverdue(invoice);

                const selected = Array.from(this.searchFilters.estados);
                estadosMatch = selected.some(s => {
                    if (s === 'vencido') return isOverdue;
                    return invoice.estado === s;
                });
            }

            return customerIdMatch && customerNameMatch && serviciosMatch && mesesMatch && aniosMatch && estadosMatch;
        });
    }

    columns: TableColumn[] = [
        { key: 'customerId', header: 'ID Cliente', classes: 'id-cell' },
        { key: 'customer', header: 'Cliente', classes: 'font-medium' },
        { key: 'servicio', header: 'Servicio' },
        { key: 'mes', header: 'Mes' },
        { key: 'anio', header: 'Año' },
        { key: 'monto', header: 'Monto', classes: 'text-right font-medium' },
        { key: 'fechaVencimiento', header: 'Vencimiento' },
        { key: 'estado', header: 'Estado' },
        { key: 'actions', header: 'Acciones', classes: 'text-right' }
    ];

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly userService: UserService,
        private readonly fb: FormBuilder
    ) {
        this.invoiceForm = this.fb.group({
            customerId: ['', Validators.required],
            servicio: ['', Validators.required],
            mes: ['', Validators.required],
            anio: [null, [Validators.required, Validators.min(2020)]],
            monto: [null, [Validators.required, Validators.min(0.01)]],
            fechaVencimiento: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.customerOptions = users.map(u => ({
                    value: u.id,
                    label: `${u.name} (${u.id})`
                }));
                this.loadInvoices();
            },
            error: (err) => {
                console.error('Error loading users', err);
                this.isLoading = false;
            }
        });
    }

    loadInvoices(): void {
        this.invoiceService.getInvoices().subscribe({
            next: (invoices) => {
                // Sort by ID desc
                this.invoices = [...invoices].sort((a, b) => b.id - a.id);
                this.generateYearList();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading invoices', err);
                this.isLoading = false;
            }
        });
    }

    getUserName(customerId: string | undefined): string {
        if (!customerId) return 'N/A';
        const user = this.users.find(u => u.id === customerId);
        return user ? user.name : customerId;
    }

    openCreateModal(): void {
        this.isEditing = false;
        this.currentEditingId = null;
        this.invoiceForm.reset();
        this.selectedFormCustomer.clear();
        this.selectedFormService.clear();
        this.selectedFormMonth.clear();
        this.selectedFormYear.clear();
        this.showModal = true;
    }

    openEditModal(invoice: Invoice): void {
        this.isEditing = true;
        this.currentEditingId = invoice.id;

        this.invoiceForm.patchValue({
            customerId: invoice.customerId,
            servicio: invoice.servicio,
            mes: invoice.mes,
            anio: invoice.anio,
            monto: invoice.monto,
            fechaVencimiento: invoice.fechaVencimiento
        });

        // Sync dropdown sets for UI
        this.selectedFormCustomer = new Set(invoice.customerId ? [invoice.customerId] : []);
        this.selectedFormService = new Set([invoice.servicio]);
        this.selectedFormMonth = new Set([invoice.mes]);
        this.selectedFormYear = new Set([invoice.anio.toString()]);

        // Keep original for change detection
        this.originalInvoice = {
            customerId: invoice.customerId,
            servicio: invoice.servicio,
            mes: invoice.mes,
            anio: invoice.anio,
            monto: invoice.monto,
            fechaVencimiento: invoice.fechaVencimiento
        };

        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
    }

    onSubmit(): void {
        if (this.invoiceForm.invalid) return;

        const formValue = this.invoiceForm.value;

        // Ensure numeric values are numbers for comparison and submission
        const invoiceData: Omit<Invoice, 'id'> = {
            customerId: formValue.customerId,
            servicio: formValue.servicio,
            mes: formValue.mes,
            anio: Number(formValue.anio),
            monto: Number(formValue.monto),
            fechaVencimiento: formValue.fechaVencimiento,
            estado: this.isEditing ? this.invoices.find(inv => inv.id === this.currentEditingId)?.estado || 'pendiente' : 'pendiente'
        };

        // Check for duplicates
        const isDuplicate = this.invoices.some(inv => {
            // If editing, skip the current invoice being edited
            if (this.isEditing && this.currentEditingId === inv.id) {
                return false;
            }

            return inv.customerId === invoiceData.customerId &&
                inv.servicio === invoiceData.servicio &&
                inv.mes === invoiceData.mes &&
                inv.anio === invoiceData.anio;
        });

        if (isDuplicate) {
            Swal.fire({
                title: 'Registro duplicado',
                text: 'Ya existe una factura registrada con el mismo cliente, servicio, mes y año.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'swal2-confirm-danger',
                    popup: 'swal2-rounded-lg'
                }
            });
            return;
        }

        if (this.isEditing && this.currentEditingId) {
            // Check for changes
            const hasChanges = Object.keys(this.originalInvoice).some(key => {
                const originalVal = this.originalInvoice[key];
                // @ts-ignore
                const currentVal = invoiceData[key as keyof typeof invoiceData];

                // Simple comparison (loose for numbers/strings just in case, but strict is better if types align)
                // Using abstract inequality to catch string vs number nuances if any remain
                return originalVal != currentVal;
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

            Swal.fire({
                title: '¿Confirmar cambios?',
                text: "¿Estás seguro de que deseas actualizar esta factura?",
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
                    // @ts-ignore
                    const updatedInvoice: Invoice = { ...invoiceData, id: this.currentEditingId };
                    this.invoiceService.updateInvoice(updatedInvoice).subscribe({
                        next: () => {
                            this.loadInvoices();
                            this.closeModal();
                            Swal.fire({
                                title: '¡Actualizado!',
                                text: 'La factura ha sido actualizada correctamente.',
                                icon: 'success',
                                confirmButtonText: 'Aceptar',
                                customClass: {
                                    confirmButton: 'swal2-confirm-success',
                                    popup: 'swal2-rounded-lg'
                                }
                            });
                        },
                        error: (err) => {
                            console.error('Error updating invoice', err);
                            this.isLoading = false;
                        }
                    });
                }
            });
        } else {
            this.isLoading = true;
            this.invoiceService.createInvoice(invoiceData).pipe().subscribe({
                next: () => {
                    this.loadInvoices();
                    this.closeModal();
                    Swal.fire({
                        title: '¡Creado!',
                        text: 'La factura ha sido registrada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            confirmButton: 'swal2-confirm-success',
                            popup: 'swal2-rounded-lg'
                        }
                    });
                },
                error: (err) => {
                    console.error('Error creating invoice', err);
                    this.isLoading = false;
                }
            });
        }
    }

    deleteInvoice(id: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'swal2-confirm-danger',
                cancelButton: 'swal2-cancel-gray',
                popup: 'swal2-rounded-lg'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading = true;
                this.invoiceService.deleteInvoice(id).subscribe({
                    next: () => {
                        this.loadInvoices();
                        Swal.fire({
                            title: '¡Eliminada!',
                            text: 'La factura ha sido eliminada.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            customClass: {
                                confirmButton: 'swal2-confirm-success',
                                popup: 'swal2-rounded-lg'
                            }
                        });
                    },
                    error: (err) => {
                        console.error('Error deleting invoice', err);
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    onServiceSelectionChange(selected: Set<any>): void {
        this.searchFilters.servicios = selected as Set<string>;
    }

    onMonthSelectionChange(selected: Set<any>): void {
        this.searchFilters.meses = selected as Set<string>;
    }

    onYearSelectionChange(selected: Set<any>): void {
        this.searchFilters.anios = selected as Set<string>;
    }

    onStatusSelectionChange(selected: Set<any>): void {
        this.searchFilters.estados = selected as Set<string>;
    }

    updateFormSelection(controlName: string, selected: Set<any>): void {
        const value = selected.size > 0 ? Array.from(selected)[0] : null;
        this.invoiceForm.get(controlName)?.setValue(value);

        // Update local Set to keep UI in sync
        if (controlName === 'servicio') this.selectedFormService = selected;
        if (controlName === 'mes') this.selectedFormMonth = selected;
        if (controlName === 'anio') this.selectedFormYear = selected;
    }

    isInvoiceOverdue(invoice: Invoice): boolean {
        if (invoice.estado !== 'pendiente') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(invoice.fechaVencimiento + 'T00:00:00');
        return dueDate < today;
    }

    private generateYearList(): void {
        const years = new Set<number>();
        this.invoices.forEach(inv => years.add(inv.anio));

        this.yearOptions = Array.from(years).sort((a, b) => b - a).map(y => ({ value: y.toString(), label: y.toString() }));
    }
}
