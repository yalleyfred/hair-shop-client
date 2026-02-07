import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {CartItem} from '../../models/cart.model';
import {ProductResponse} from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'cart_items';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadItems());
  public readonly items$ = this.itemsSubject.asObservable();
  public readonly total$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  );
  public readonly count$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  public addItem(product: ProductResponse, quantity = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
      this.updateItems(items);
      return;
    }

    items.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.productUrl,
      quantity
    });

    this.updateItems(items);
  }

  public updateQuantity(productId: string, quantity: number): void {
    const items = [...this.itemsSubject.value];
    const target = items.find((item) => item.productId === productId);

    if (!target) {
      return;
    }

    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    target.quantity = quantity;
    this.updateItems(items);
  }

  public removeItem(productId: string): void {
    const items = this.itemsSubject.value.filter((item) => item.productId !== productId);
    this.updateItems(items);
  }

  public clear(): void {
    this.updateItems([]);
  }

  private updateItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private loadItems(): CartItem[] {
    if (typeof window === 'undefined') {
      return [];
    }
    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
