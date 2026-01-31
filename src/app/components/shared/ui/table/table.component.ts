import { Component, ContentChildren, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, TemplateRef, AfterContentInit } from '@angular/core';
import { TableTemplateDirective } from './table-template.directive';

export interface TableColumn {
    key: string;
    header: string;
    classes?: string; // CSS classes for the cell (e.g. 'text-right')
}

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges, AfterContentInit {
    @Input() data: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() pageSize: number = 10;
    @Input() isLoading: boolean = false;

    @ContentChildren(TableTemplateDirective) templateDirectives!: QueryList<TableTemplateDirective>;

    // Map of column key to template
    templates: { [key: string]: TemplateRef<any> } = {};

    // For row clicking
    @Input() rowClickable: boolean = false;
    @Output() rowClick = new EventEmitter<any>();

    // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    paginatedData: any[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['pageSize']) {
            this.calculatePagination();
        }
    }

    ngAfterContentInit(): void {
        this.templateDirectives.forEach(dir => {
            this.templates[dir.name] = dir.template;
        });
    }

    calculatePagination(): void {
        if (!this.data || this.data.length === 0) {
            this.paginatedData = [];
            this.totalPages = 1;
            this.currentPage = 1;
            return;
        }

        this.totalPages = Math.ceil(this.data.length / this.pageSize);

        // Ensure current page is valid
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        } else if (this.currentPage < 1) {
            this.currentPage = 1;
        }

        this.updatePaginatedData();
    }

    updatePaginatedData(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedData = this.data.slice(startIndex, endIndex);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedData();
        }
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedData();
        }
    }

    onRowClick(item: any): void {
        if (this.rowClickable) {
            this.rowClick.emit(item);
        }
    }

    // Helper to check if a specific column has a template
    hasTemplate(key: string): boolean {
        return !!this.templates[key];
    }
}
