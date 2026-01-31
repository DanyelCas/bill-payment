import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Invoice } from '../../../../models/invoice.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
})
export class InvoiceTableComponent implements OnChanges {
  @Input() invoices: Invoice[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Input() hasSearched = false;

  @Output() payInvoice = new EventEmitter<Invoice>();
  @Output() payInvoices = new EventEmitter<Invoice[]>();

  constructor(private cdr: ChangeDetectorRef) { }

  selectedInvoiceIds = new Set<number>();

  // Filters
  // Filters
  searchTerm: string = '';
  statusFilter = new Set<string>(['pendiente', 'vencida']); // Default to Pending and Overdue
  serviceFilter = new Set<string>();
  private defaultsInitialized = false;

  // Dropdown Options
  statusOptions: any[] = [
    { value: 'pendiente', label: 'Pendiente', badgeClass: 'estado-pendiente' },
    { value: 'pagado', label: 'Pagado', badgeClass: 'estado-pagado' },
    { value: 'vencida', label: 'Vencida', badgeClass: 'estado-vencida' }
  ];

  serviceOptions: any[] = [];

  // View mode: 'list' or 'grouped'
  viewMode: 'list' | 'grouped' = 'list';

  displayedInvoices: Invoice[] = []; // All filtered invoices

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoices'] || changes['invoicesChange']) {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    // Update service options dynamically based on available invoices
    this.updateServiceOptions();

    // Default to "All Services" selected if not already initialized
    if (!this.defaultsInitialized && this.invoices.length > 0) {
      this.invoices.forEach(inv => this.serviceFilter.add(inv.servicio));
      this.defaultsInitialized = true;
    }

    this.displayedInvoices = this.invoices.filter(invoice => {
      const matchesSearch =
        invoice.servicio.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        invoice.periodo.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status Filter (Multi-select)
      let matchesStatus = true;
      if (this.statusFilter.size > 0) {
        // Special handling for 'vencida' because it's a computed property, not a stored value
        const isVencida = this.isOverdue(invoice);
        const isPendiente = this.isPending(invoice) && !isVencida;
        const isPagado = invoice.estado === 'pagado';

        // Check if any of the selected statuses match the invoice's current true status
        const matchesVencida = this.statusFilter.has('vencida') && isVencida;
        const matchesPendiente = this.statusFilter.has('pendiente') && isPendiente;
        const matchesPagado = this.statusFilter.has('pagado') && isPagado;

        matchesStatus = matchesVencida || matchesPendiente || matchesPagado;
      }

      // Service Filter (Multi-select)
      let matchesService = true;
      if (this.serviceFilter.size > 0) {
        matchesService = this.serviceFilter.has(invoice.servicio);
      }

      return matchesSearch && matchesStatus && matchesService;
    });

    this.currentPage = 1; // Reset to first page on filter change
    this.cdr.detectChanges();
  }

  updateServiceOptions(): void {
    const services = [...new Set(this.invoices.map(i => i.servicio))].sort();
    this.serviceOptions = services.map(service => ({
      value: service,
      label: service
    }));
  }

  // Handle filter changes from dropdowns
  onServiceFilterChange(selected: Set<any>): void {
    this.serviceFilter = selected;
    this.applyFilters();
  }

  onStatusFilterChange(selected: Set<any>): void {
    this.statusFilter = selected;
    this.applyFilters();
  }

  get paginatedInvoices(): Invoice[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.displayedInvoices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.displayedInvoices.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get canNext(): boolean { return this.currentPage < this.totalPages; }
  get canPrev(): boolean { return this.currentPage > 1; }

  get uniqueServices(): string[] {
    return [...new Set(this.invoices.map(i => i.servicio))];
  }

  get groupedInvoices(): { service: string; invoices: Invoice[]; total: number }[] {
    if (this.viewMode !== 'grouped') return [];

    const groups = new Map<string, Invoice[]>();

    this.displayedInvoices.forEach(invoice => {
      if (!groups.has(invoice.servicio)) {
        groups.set(invoice.servicio, []);
      }
      groups.get(invoice.servicio)!.push(invoice);
    });

    return Array.from(groups.entries()).map(([service, invoices]) => ({
      service,
      invoices,
      total: invoices.reduce((sum, inv) => sum + inv.monto, 0)
    }));
  }

  get overdueInvoicesCount(): number {
    return this.invoices.filter(inv => this.isOverdue(inv)).length;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grouped' : 'list';
  }


  formatCurrency(amount: number): string {
    return 'Bs. ' + new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    // dateStr is YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  getEstadoClass(invoice: Invoice): string {
    if (invoice.estado === 'pagado') return 'estado-pagado';
    if (this.isOverdue(invoice)) return 'estado-vencida';
    return 'estado-pendiente';
  }

  isPending(invoice: Invoice): boolean {
    return invoice.estado === 'pendiente';
  }

  isOverdue(invoice: Invoice): boolean {
    if (invoice.estado !== 'pendiente') return false;

    // Si tiene campo fechaVencimiento, usarlo
    if (invoice.fechaVencimiento) {
      const agnostica = new Date(invoice.fechaVencimiento + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Comparar solo fechas
      return agnostica < hoy;
    }

    return false;
  }

  toggleSelection(invoice: Invoice, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!this.isPending(invoice)) return;

    if (this.selectedInvoiceIds.has(invoice.id)) {
      // VALIDATION: Check for later selected invoices before deselecting
      const laterSelected = this.findLaterSelectedInvoices(invoice);

      if (laterSelected.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Acción no permitida',
          html: `
            <div style="text-align: left; color: #333;">
              <p style="margin-bottom: 15px;">
                No puedes deseleccionar <strong>${invoice.periodo}</strong> porque tienes facturas posteriores seleccionadas:
              </p>
              <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
                ${laterSelected.map(inv => `
                  <li style="margin-bottom: 5px;">
                    <strong>${inv.periodo}</strong> 
                    <span style="color: #64748B;">(${this.formatCurrency(inv.monto)})</span>
                  </li>
                `).join('')}
              </ul>
              <p style="margin-top: 15px; font-size: 0.9em; font-style: italic; color: #64748B;">
                Debes deseleccionar las facturas posteriores primero para mantener el orden cronológico.
              </p>
            </div>
          `,
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'swal2-confirm-primary',
            popup: 'swal2-rounded-lg'
          }
        });
        return;
      }

      this.selectedInvoiceIds.delete(invoice.id);
    } else {
      // VALIDATION: Check for earlier pending invoices before selecting
      const earlierPending = this.findEarlierPendingInvoices(invoice);

      // Filter out those that are ALREADY selected
      const missingEarlier = earlierPending.filter(inv => !this.selectedInvoiceIds.has(inv.id));

      if (missingEarlier.length > 0) {
        // Show stylish warning
        Swal.fire({
          icon: 'warning',
          title: 'Pago no permitido',
          html: `
            <div style="text-align: left; color: #333;">
              <p style="margin-bottom: 15px;">
                No puedes seleccionar <strong>${invoice.servicio}</strong> de <strong>${invoice.periodo}</strong> 
                porque tienes facturas anteriores pendientes:
              </p>
              <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
                ${missingEarlier.map(inv => `
                  <li style="margin-bottom: 5px;">
                    <strong>${inv.periodo}</strong> 
                    <span style="color: #64748B;">(${this.formatCurrency(inv.monto)})</span>
                    ${this.isOverdue(inv) ? '<span style="color: #DC2626; font-weight: bold; font-size: 0.8em; margin-left: 5px;">VENCIDA</span>' : ''}
                  </li>
                `).join('')}
              </ul>
              <p style="margin-top: 15px; font-size: 0.9em; font-style: italic; color: #64748B;">
                Selecciona las facturas anteriores para habilitar este periodo.
              </p>
            </div>
          `,
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'swal2-confirm-primary',
            popup: 'swal2-rounded-lg'
          }
        });
        return;
      }

      this.selectedInvoiceIds.add(invoice.id);
    }
  }

  /**
   * Finds earlier pending invoices for the same service
   */
  private findEarlierPendingInvoices(invoice: Invoice): Invoice[] {
    const invoiceDate = this.parsePeriodo(invoice.periodo);

    return this.invoices.filter(inv => {
      // Same service, pending/overdue, not the same ID
      if (inv.servicio !== invoice.servicio) return false;
      if (inv.estado === 'pagado') return false;
      if (inv.id === invoice.id) return false;

      const invDate = this.parsePeriodo(inv.periodo);
      return invDate < invoiceDate;
    }).sort((a, b) => {
      const dateA = this.parsePeriodo(a.periodo);
      const dateB = this.parsePeriodo(b.periodo);
      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Finds later invoices for the same service that are currently selected
   */
  private findLaterSelectedInvoices(invoice: Invoice): Invoice[] {
    const invoiceDate = this.parsePeriodo(invoice.periodo);

    return this.invoices.filter(inv => {
      // Same service
      if (inv.servicio !== invoice.servicio) return false;
      // Is selected
      if (!this.selectedInvoiceIds.has(inv.id)) return false;
      // Not the same ID
      if (inv.id === invoice.id) return false;

      const invDate = this.parsePeriodo(inv.periodo);
      return invDate > invoiceDate;
    }).sort((a, b) => {
      const dateA = this.parsePeriodo(a.periodo);
      const dateB = this.parsePeriodo(b.periodo);
      // Sort ascending (earliest later invoice first)
      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Helper to parse 'Month Year' string to Date
   */
  private parsePeriodo(periodo: string): Date {
    const meses: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    const parts = periodo.toLowerCase().split(' ');
    // Default to Jan if parse fails, but data should be correct
    const mes = meses[parts[0]] !== undefined ? meses[parts[0]] : 0;
    const anio = parseInt(parts[1], 10) || new Date().getFullYear();

    return new Date(anio, mes, 1);
  }

  onRowClick(invoice: Invoice, event: Event): void {
    const target = event.target as HTMLElement;
    // Don't trigger row click if clicking interactive elements or their containers
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.closest('.card-checkbox') || // Ignore click on checkbox container
      target.closest('.col-checkbox')
    ) {
      return;
    }

    this.toggleSelection(invoice);
  }

  trackByFn(index: number, invoice: Invoice): number {
    return invoice.id;
  }

  trackByGroup(index: number, group: { service: string }): string {
    return group.service;
  }

  toggleAll(event: any): void {
    if (event.target.checked) {
      this.invoices
        .filter((inv) => this.isPending(inv))
        .filter((inv) => this.isPending(inv))
        // We could apply validation here too, but for "Select All" it's usually expected to auto-select what's possible
        // Or select everything because if we select everything, the gaps are filled by definition.
        // Simple approach: Allow "Select All" to select even partials if it fills gaps?
        // Actually, "Select All" selects ALL displayed. If all displayed are selected, then by definition previous ones are selected too (unless search hidden them).
        // Let's keep distinct behaviors: Toggle All adds IDs directly.
        // Ideally we should verify if 'displayedInvoices' contains the gaps. 
        // For simplicity and best UX in "Select All": Select all displayed.
        .forEach((inv) => this.selectedInvoiceIds.add(inv.id));
    } else {
      this.selectedInvoiceIds.clear();
    }
  }

  isAllSelected(): boolean {
    const pendingInvoices = this.invoices.filter((inv) => this.isPending(inv));
    return (
      pendingInvoices.length > 0 &&
      pendingInvoices.every((inv) => this.selectedInvoiceIds.has(inv.id))
    );
  }

  hasPendingInvoices(): boolean {
    return this.invoices.some(inv => this.isPending(inv));
  }

  onPaySelected(): void {
    const selected = this.invoices.filter((inv) =>
      this.selectedInvoiceIds.has(inv.id) && this.isPending(inv)
    );
    this.payInvoices.emit(selected);
  }

  clearSelection(): void {
    this.selectedInvoiceIds.clear();
  }

  onPayClick(invoice: Invoice): void {
    this.payInvoice.emit(invoice);
  }
}
