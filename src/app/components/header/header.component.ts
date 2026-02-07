import {
  ChangeDetectionStrategy,
  Component, EventEmitter, inject, Input,
  Output,
} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {DialogService} from '../../service/dialog/dialog.service';
import {CartService} from '../../service/cart/cart.service';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatBadgeModule,
    MatButton,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  @Input()
  public isAuthenticated: boolean = false;

  @Output()
  public authenticatedChange: EventEmitter<boolean> = new EventEmitter();

  public router = inject(Router)
  public dialogService = inject(DialogService)
  public cartService = inject(CartService)
  public cartCount$ = this.cartService.count$;


  public logout(): void {
    localStorage.removeItem('user');
    this.isAuthenticated = !!localStorage.getItem('user');
    this.authenticatedChange.emit(this.isAuthenticated);
    this.router.navigate(['login']);
  }

  public async openCart(): Promise<void> {
    const {CartComponent} = await import('../../pages/cart/cart.component');
    this.dialogService.open(CartComponent);
  }

}
