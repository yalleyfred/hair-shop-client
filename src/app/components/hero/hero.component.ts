import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';

import {MatIcon} from '@angular/material/icon';
import {DialogService} from '../../service/dialog/dialog.service';
import {BookingComponent} from '../../pages/booking/booking.component';
import {BookingListComponent} from '../bookings-list/booking-list.component';
import {ProductsComponent} from '../../pages/products/products.component';
import {AddProductComponent} from '../add-product/add-product.component';
import {ServicesListComponent} from '../services-list/services-list.component';
import {AddServiceComponent} from '../add-service/add-service.component';
import {ManageCategoriesComponent} from '../manage-categories/manage-categories.component';

@Component({
  selector: 'app-hero',
  imports: [
    MatCardContent,
    MatCard,
    MatCardActions,
    MatButton,
    MatIcon,
    MatIconButton,
    MatCardImage
],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  public products = [
    {
      name: 'Shampoo',
      description: 'For smooth and shiny hair.',
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673713726/image/kgftnnqqz5cn1bje4di2.jpg',
    },
    {
      name: 'Conditioner',
      description: 'For soft and manageable hair.',
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673714220/image/srnsoe8v6rntnuzuw0cp.jpg',
    },
    {
      name: 'Hair Mask',
      description: 'Deep conditioning treatment.',
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673710699/image/r69rcnaj4ibdawjovkwf.png',
    },
    {
      name: 'Hair Oil',
      description: 'For nourished and healthy hair.',
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673706865/image/rc7narlv7f0zwnqzzbqq.jpg',
    },
    // Add more products
  ];
  currentIndex = 2;
  visibleProducts: any = []

  @Input()
  public isAuthenticated: boolean = false;

  public sideDialogService = inject(DialogService);

  ngOnInit() {
    this.visibleProducts = this.products.slice(0, 3); // Show three cards at a time
    console.log('visProd', this.visibleProducts);

  }

  public nextCard() {
    if (this.currentIndex < this.products.length - 1) {
      this.currentIndex++;
      this.updateVisibleProducts();
    }
  }

  public prevCard() {
    if (this.currentIndex > 2) {
      this.currentIndex--;
      this.updateVisibleProducts();
    }
  }

  public updateVisibleProducts() {
    this.visibleProducts = this.products.slice(
      this.currentIndex - 2,
      this.currentIndex + 1
    );
  }

  public openBooking() {
    this.sideDialogService.open(BookingComponent);
  }

  public showAllBooking() {
    this.sideDialogService.open(BookingListComponent);
  }

  public showAllProducts() {
    this.sideDialogService.open(ProductsComponent);
  }

  public addProduct() {
    this.sideDialogService.open(AddProductComponent);
  }

  public showAllServices() {
    this.sideDialogService.open(ServicesListComponent);
  }

  public addService() {
    this.sideDialogService.open(AddServiceComponent);
  }

  public manageCategories() {
    this.sideDialogService.open(ManageCategoriesComponent);
  }
}
