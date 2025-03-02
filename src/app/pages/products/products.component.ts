import {Component} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatDialogClose} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {Booking} from '../../models/booking.model';
import {filter, Subscription} from 'rxjs';
import {BookingService} from '../../service/bookings/bookings.service';
import {Product} from '../../models/product.model';
import {ProductsService} from '../../service/products/products.service';

@Component({
  selector: 'app-products',
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDialogClose,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  public displayedColumns: string[] = ['id', 'name', 'price', 'description', 'actions'];
  public products: Product[] = [];

  public subscription = new Subscription();

  constructor(private readonly productService: ProductsService) {
    this.productService.getProducts().subscribe((products) => this.products = products);
  }

  public editProduct(product: Product) {
    console.log('Edit product:', product);
  }

  public deleteProduct(product: Product) {
    // this.products = this.products.filter((b) => b.id !== product.id);
    console.log('Deleted product:', product);
  }
}
