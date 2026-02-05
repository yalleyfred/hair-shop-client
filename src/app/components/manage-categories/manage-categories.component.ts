import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatError} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ServicesService} from '../../service/services/services.service';
import {ServiceCategory} from '../../models/service.model';

@Component({
  selector: 'app-manage-categories',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatDivider,
    MatError,
    MatProgressSpinner
  ],
  templateUrl: './manage-categories.component.html',
  styleUrl: './manage-categories.component.css'
})
export class ManageCategoriesComponent implements OnInit {
  public categoryForm: FormGroup;
  public categories: ServiceCategory[] = [];
  public isSaving = false;
  public isUpdating = false;
  public isDeletingId: string | null = null;
  public editingCategoryId: string | null = null;
  public editForm: FormGroup;
  public createSubmitted = false;
  public editSubmitted = false;
  public errorMessage = '';

  constructor(private readonly fb: FormBuilder, private readonly servicesService: ServicesService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.servicesService.getCategories().subscribe((categories: ServiceCategory[]) => {
      this.categories = categories;
    });
  }

  public createCategory(): void {
    this.createSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.servicesService.createCategory(this.categoryForm.value).subscribe({
      next: (category: ServiceCategory) => {
        this.categories = [category, ...this.categories];
        this.loadCategories();
        this.categoryForm.reset();
        this.createSubmitted = false;
        this.isSaving = false;
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to create category';
      }
    });
  }

  public editCategory(category: ServiceCategory): void {
    this.editingCategoryId = category.id;
    this.editForm.setValue({
      name: category.name,
      description: category.description || ''
    });
  }

  public cancelEdit(): void {
    this.editingCategoryId = null;
    this.editForm.reset();
    this.editSubmitted = false;
  }

  public saveEdit(): void {
    this.editSubmitted = true;
    if (!this.editingCategoryId || this.editForm.invalid) {
      return;
    }
    this.isUpdating = true;
    const payload = {
      name: this.editForm.value.name.trim(),
      description: this.editForm.value.description || undefined
    };
    this.servicesService.updateCategory(this.editingCategoryId, payload).subscribe({
      next: () => {
        this.isUpdating = false;
        this.cancelEdit();
        this.loadCategories();
      },
      error: (err) => {
        this.isUpdating = false;
        this.errorMessage = err.error?.message || 'Failed to update category';
      }
    });
  }

  public deleteCategory(category: ServiceCategory): void {
    const confirmed = confirm(`Delete category "${category.name}"?`);
    if (!confirmed) {
      return;
    }
    this.isDeletingId = category.id;
    this.servicesService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== category.id);
        this.loadCategories();
        this.isDeletingId = null;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete category';
        this.isDeletingId = null;
      }
    });
  }
}
