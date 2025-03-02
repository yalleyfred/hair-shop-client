import {Component} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {ProductsService} from '../../service/products/products.service';
import {MatDialogClose} from '@angular/material/dialog';

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
  productForm: FormGroup;
  selectedFile: File | null = null;
  public errorMessage: string = '';

  constructor(private readonly fb: FormBuilder, private readonly productsService: ProductsService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image: [null, Validators.required], // File input
    });
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
      // You can send `formData` to your backend API here
    } else {
      console.log('Form is invalid');
    }
  }
}
