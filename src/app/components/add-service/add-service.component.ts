import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatError} from '@angular/material/form-field';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {ServicesService} from '../../service/services/services.service';
import {CreateServiceCategoryPayload, SalonService, ServiceCategory} from '../../models/service.model';

@Component({
  selector: 'app-add-service',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatSelect,
    MatOption,
    MatError,
    MatDialogClose,
    MatIcon,
  ],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css'
})
export class AddServiceComponent implements OnInit {
  public serviceForm: FormGroup;
  public categoryForm: FormGroup;
  public categories: ServiceCategory[] = [];
  public errorMessage = '';
  public isSaving = false;
  public isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly servicesService: ServicesService,
    private readonly dialogRef: MatDialogRef<AddServiceComponent>,
    @Inject(MAT_DIALOG_DATA) protected readonly dialogData?: Partial<SalonService>
  ) {
    this.isEditMode = !!dialogData?.id;
    this.serviceForm = this.fb.group({
      name: [dialogData?.name || '', Validators.required],
      price: [dialogData?.price || null, [Validators.required, Validators.min(0)]],
      description: [dialogData?.description || '', Validators.required],
      durationMinutes: [dialogData?.durationMinutes ?? null, [Validators.min(0)]],
      categoryId: [dialogData?.categoryId || '', Validators.required],
    });

    this.categoryForm = this.fb.group({
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
      // If we opened the dialog with a preset category, select it.
      if (this.dialogData?.categoryId) {
        this.serviceForm.get('categoryId')?.setValue(this.dialogData.categoryId);
      }
    });
  }

  public onSubmit(): void {
    if (this.serviceForm.invalid) {
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    const payload = this.serviceForm.value;
    const request$ = this.isEditMode && this.dialogData?.id
      ? this.servicesService.updateService(this.dialogData.id, payload)
      : this.servicesService.createService(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.serviceForm.reset();
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Service save failed';
      }
    });
  }
}
