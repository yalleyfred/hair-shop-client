import {ChangeDetectionStrategy, Component, DestroyRef} from '@angular/core';
import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {CartService} from '../../service/cart/cart.service';
import {DialogService} from '../../service/dialog/dialog.service';
import {PaymentComponent} from '../../components/payment/payment.component';
import {CartItem} from '../../models/cart.model';
import {Observable} from 'rxjs';
import {ProductsService} from '../../service/products/products.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatDialogClose,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  public items$: Observable<CartItem[]>;
  public total$: Observable<number>;
  private readonly availableById: Record<string, number> = {};

  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly dialogService: DialogService,
    private readonly dialogRef: MatDialogRef<CartComponent>,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.total$;

    this.productsService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        products.forEach((product) => {
          this.availableById[product.id] = Number(product.quantity);
        });
      });
  }

  public increase(item: CartItem): void {
    if (!this.canIncrease(item)) {
      return;
    }
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  public decrease(item: CartItem): void {
    if (item.quantity <= 1) {
      this.cartService.removeItem(item.productId);
      return;
    }
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  public remove(item: CartItem): void {
    this.cartService.removeItem(item.productId);
  }

  public clear(): void {
    this.cartService.clear();
  }

  public continueShopping(): void {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }

  public canIncrease(item: CartItem): boolean {
    const available = this.availableById[item.productId];
    if (typeof available !== 'number') {
      return false;
    }
    return item.quantity < available;
  }

  public checkout(total: number | null | undefined): void {
    if (!total || total <= 0) {
      return;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('payment_reference');
    }
    this.dialogService.open(PaymentComponent, {
      data: {
        amount: Number(total)
      }
    });
  }

}
