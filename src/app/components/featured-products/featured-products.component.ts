import {ChangeDetectionStrategy, Component} from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {ProductsService} from '../../service/products/products.service';
import {DialogService} from '../../service/dialog/dialog.service';
import {PaymentComponent} from '../payment/payment.component';
import {Observable} from 'rxjs';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-featured-products',
  imports: [
    CurrencyPipe,
    MatButton,
    AsyncPipe
],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProductsComponent {
  public products$: Observable<any>;

  constructor(
    private readonly productService: ProductsService,
    private readonly dialogService: DialogService
  ) {
    this.products$ = this.productService.products$;
    this.productService.refreshProducts();
  }

  public buyProduct(product: any) {
    if (!product?.price) {
      return;
    }
    this.dialogService.open(PaymentComponent, {
      data: {
        amount: Number(product.price)
      }
    });
  }

  public addToCart(product: any) {
    console.log('Add to Cart:', product);
    // Add logic to add product to cart
  }
}
