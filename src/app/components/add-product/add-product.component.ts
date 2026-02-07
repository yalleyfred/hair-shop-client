import {Component, Inject} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';

import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ProductsService} from '../../service/products/products.service';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {ProductResponse} from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  imports: [
    MatError,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatLabel,
    MatCard,
    MatButton,
    MatDialogClose,
    MatIcon
],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  public productForm: FormGroup;
  public selectedFile: File | null = null;
  public errorMessage: string = '';
  public isSaving = false;
  public submitted = false;

  constructor(private readonly fb: FormBuilder, private readonly productsService: ProductsService, @Inject(MAT_DIALOG_DATA) protected readonly dialogData: ProductResponse) {
    if (this.dialogData === null) {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        price: [null, [Validators.required, Validators.min(0)]],
        description: ['', Validators.required],
        image: [null, Validators.required],
      });
    } else {
      console.log('dialogData', dialogData);
      this.productForm = this.fb.group({
        name: [this.dialogData.name, Validators.required],
        price: [Number(this.dialogData.price), [Validators.required, Validators.min(0)]],
        description: [this.dialogData.description, Validators.required],
        image: [null, Validators.required],
      })
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.productForm.patchValue({
        image: file,
      });
      this.productForm.get('image')?.markAsTouched();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const priceValue = Number(this.productForm.get('price')?.value);
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', priceValue.toString());
    formData.append('description', this.productForm.get('description')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request$ = this.dialogData
      ? this.productsService.updateProduct(formData, this.dialogData.id)
      : this.productsService.createProduct(formData);

    request$.subscribe(
      () => {
        this.isSaving = false;
        this.submitted = false;
        this.productForm.reset();
      },
      (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Product save failed';
      }
    );
  }
}
