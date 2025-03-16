import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../service/products/products.service';
import {ProductResponse} from '../../models/product.model';
import {Observable} from 'rxjs';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-featured-products',
  imports: [
    NgForOf,
    CurrencyPipe,
    AsyncPipe,
    NgIf,
    MatButton,
  ],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProductsComponent {
  public products$: Observable<ProductResponse[]> | null = null;

  constructor(private readonly productService: ProductsService) {
    this.products$ = this.productService.getProducts();
  }

  public buyProduct(product: any) {
    console.log('View Details:', product);
    // Add logic to navigate to product details page
  }

  public addToCart(product: any) {
    console.log('Add to Cart:', product);
    // Add logic to add product to cart
  }
}
