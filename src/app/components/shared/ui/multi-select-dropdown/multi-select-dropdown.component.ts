import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

export interface DropdownOption {
  value: any;
  label: string;
  badgeClass?: string; // Optional class for badges (e.g., 'estado-vencida')
  badgeLabel?: string; // Optional text for badges if different from label
}

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Seleccionar...';
  @Input() icon: string = 'filter'; // Default icon
  @Input() selectedValues: Set<any> = new Set();
  @Input() singleSelection: boolean = false;
  @Input() showSearch: boolean = false;

  @Output() selectionChange = new EventEmitter<Set<any>>();

  isOpen = false;
  searchText = '';

  constructor(private elementRef: ElementRef) { }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  toggleSelection(value: any, event: Event): void {
    event.stopPropagation();

    if (this.singleSelection) {
      this.selectedValues.clear();
      this.selectedValues.add(value);
      this.closeDropdown();
    } else {
      if (this.selectedValues.has(value)) {
        this.selectedValues.delete(value);
      } else {
        this.selectedValues.add(value);
      }
    }

    // Convert to new Set to trigger change detection if needed, or just emit
    this.selectionChange.emit(new Set(this.selectedValues));
  }

  isSelected(value: any): boolean {
    return this.selectedValues.has(value);
  }

  get buttonLabel(): string {
    if (this.selectedValues.size === 0) {
      return this.placeholder;
    }
    if (this.selectedValues.size === 1) {
      // Find label
      const selectedOption = this.options.find(opt => opt.value === [...this.selectedValues][0]);
      return selectedOption ? selectedOption.label : this.placeholder;
    }
    return `${this.placeholder} (${this.selectedValues.size})`;
  }

  get filteredOptions(): DropdownOption[] {
    if (!this.searchText) return this.options;
    const search = this.searchText.toLowerCase();
    return this.options.filter(opt =>
      opt.label.toLowerCase().includes(search) ||
      (opt.value && opt.value.toString().toLowerCase().includes(search))
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
