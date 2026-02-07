import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {CartService} from '../../service/cart/cart.service';
import {DialogService} from '../../service/dialog/dialog.service';
import {PaymentComponent} from '../../components/payment/payment.component';
import {CartItem} from '../../models/cart.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatDialogClose,
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  public items$: Observable<CartItem[]>;
  public total$: Observable<number>;

  constructor(
    private readonly cartService: CartService,
    private readonly dialogService: DialogService,
    private readonly dialogRef: MatDialogRef<CartComponent>,
    private readonly router: Router
  ) {
    this.items$ = this.cartService.items$;
    this.total$ = this.cartService.total$;
  }

  public increase(item: CartItem): void {
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

  public checkout(total: number | null | undefined): void {
    if (!total || total <= 0) {
      return;
    }
    this.dialogService.open(PaymentComponent, {
      data: {
        amount: Number(total)
      }
    });
  }
}
