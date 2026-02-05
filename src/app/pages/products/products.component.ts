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
import {ProductResponse} from '../../models/product.model';
import {ProductsService} from '../../service/products/products.service';
import {DialogService} from '../../service/dialog/dialog.service';
import {AddProductComponent} from '../../components/add-product/add-product.component';

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
  public products: ProductResponse[] = [];


  constructor(private readonly productService: ProductsService, private readonly sideDialogService: DialogService) {
    this.productService.products$.subscribe((products: ProductResponse[]) => this.products = products);
    this.productService.refreshProducts();
  }

  public editProduct(product: ProductResponse) {
    this.sideDialogService.open(AddProductComponent, {
      data: product,
    })
  }

  public deleteProduct(product: ProductResponse) {
    this.productService.deleteProduct(product, product.id).subscribe((res: ProductResponse) => {
      this.products = this.products.filter((data: ProductResponse) => data.id !== res.id)
    })
  }
}
