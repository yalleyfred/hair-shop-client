import {Component, Inject} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
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
    NgIf,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatLabel,
    MatCard,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  public productForm: FormGroup;
  public selectedFile: File | null = null;
  public errorMessage: string = '';

  constructor(private readonly fb: FormBuilder, private readonly productsService: ProductsService, @Inject(MAT_DIALOG_DATA) protected readonly dialogData: ProductResponse) {
    if (this.dialogData === null) {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        price: ['', [Validators.required, Validators.min(0)]],
        description: ['', Validators.required],
        image: [null, Validators.required], // File input
      });
    } else {
      console.log('dialogData', dialogData);
      this.productForm = this.fb.group({
        name: [this.dialogData.name, Validators.required],
        price: [this.dialogData.price, [Validators.required, Validators.min(0)]],
        description: [this.dialogData.description, Validators.required],
        image: [this.dialogData.productUrl, Validators.required],
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
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      if (this.dialogData) {
        this.productsService.updateProduct(formData, this.dialogData.id).subscribe((res) => {
          this.productForm.reset();
          this.errorMessage = '';
        });
      } else {
        console.log('Form Data:', formData);
        this.productsService.createProduct(formData).subscribe(
          (res) => {
            console.log('res', res);
            this.productForm.reset();
            this.errorMessage = '';
          },
          (err) => {
            console.log('err', err);
            this.errorMessage = err.error.message || 'Product creation failed';
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
