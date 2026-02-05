import {Component, OnInit} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {forkJoin} from 'rxjs';
import {AddServiceComponent} from '../add-service/add-service.component';
import {DialogService} from '../../service/dialog/dialog.service';
import {ServicesService} from '../../service/services/services.service';
import {SalonService, ServiceCategory} from '../../models/service.model';

@Component({
  selector: 'app-services-list',
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatCell,
    MatRow,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef
  ],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.css'
})
export class ServicesListComponent implements OnInit {
  public categories: ServiceCategory[] = [];
  public servicesByCategory: Record<string, SalonService[]> = {};
  public isLoading = false;
  public displayedColumns: string[] = ['name', 'price', 'duration', 'description', 'actions'];

  constructor(private readonly servicesService: ServicesService, private readonly sideDialogService: DialogService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    forkJoin([
      this.servicesService.getCategories(),
      this.servicesService.getServices()
    ]).subscribe({
      next: ([categories, services]) => {
        this.categories = categories;
        this.servicesByCategory = categories.reduce((acc: Record<string, SalonService[]>, category) => {
          acc[category.id] = services.filter((service: SalonService) => service.categoryId === category.id);
          return acc;
        }, {});
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public servicesFor(categoryId: string): SalonService[] {
    return this.servicesByCategory[categoryId] || [];
  }

  public openAddService(category?: ServiceCategory): void {
    const dialogRef = this.sideDialogService.open(AddServiceComponent, {
      data: category ? {categoryId: category.id} : undefined,
    });

    dialogRef.afterClosed().subscribe((shouldRefresh: unknown) => {
      if (shouldRefresh === true) {
        this.loadData();
      }
    });
  }

  public trackCategory(_index: number, category: ServiceCategory): string {
    return category.id;
  }

  public editService(service: SalonService): void {
    const dialogRef = this.sideDialogService.open(AddServiceComponent, {
      data: {
        ...service,
        categoryId: service.category?.id || service.categoryId,
      }
    });

    dialogRef.afterClosed().subscribe((shouldRefresh: unknown) => {
      if (shouldRefresh === true) {
        this.loadData();
      }
    });
  }

  public deleteService(service: SalonService): void {
    const confirmed = confirm(`Delete service "${service.name}"?`);
    if (!confirmed) {
      return;
    }
    this.servicesService.deleteService(service.id).subscribe(() => {
      this.loadData();
    });
  }

  public editCategory(category: ServiceCategory): void {
    const name = prompt('Update category name', category.name);
    if (!name) {
      return;
    }
    const description = prompt('Update category description', category.description || '');
    this.servicesService.updateCategory(category.id, {name: name.trim(), description: description || undefined}).subscribe(() => {
      this.loadData();
    });
  }

  public deleteCategory(category: ServiceCategory): void {
    if (this.servicesFor(category.id).length) {
      alert('Delete services in this category before deleting the category.');
      return;
    }
    const confirmed = confirm(`Delete category "${category.name}"?`);
    if (!confirmed) {
      return;
    }
    this.servicesService.deleteCategory(category.id).subscribe(() => {
      this.loadData();
    });
  }
}
