import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ProductsService} from '../../service/products/products.service';
import {map, Observable} from 'rxjs';
import {CartService} from '../../service/cart/cart.service';
import {ProductResponse} from '../../models/product.model';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {DialogService} from '../../service/dialog/dialog.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-featured-products',
  imports: [
    CurrencyPipe,
    AsyncPipe,
    MatSnackBarModule
],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProductsComponent {
  public products$: Observable<ProductResponse[]>;

  constructor(
    private readonly productService: ProductsService,
    private readonly cartService: CartService,
    private readonly snackBar: MatSnackBar,
    private readonly dialogService: DialogService
  ) {
    this.products$ = this.productService.products$.pipe(
      map((products) => products.filter((product) => Number(product.quantity) > 0))
    );
    this.productService.refreshProducts();
  }

  public addToCart(product: ProductResponse) {
    if (!product?.id || !product?.price) {
      return;
    }
    this.cartService.addItem(product);
    const snack = this.snackBar.open(`${product.name} added to cart`, 'View Cart', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    snack.onAction().subscribe(() => {
      this.openCart();
    });
  }

  public async openCart(): Promise<void> {
    const {CartComponent} = await import('../../pages/cart/cart.component');
    this.dialogService.open(CartComponent);
  }
}
