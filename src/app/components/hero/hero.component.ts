import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';

import {MatIcon} from '@angular/material/icon';
import {DialogService} from '../../service/dialog/dialog.service';

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

  public async openBooking() {
    const {BookingComponent} = await import('../../pages/booking/booking.component');
    this.sideDialogService.open(BookingComponent);
  }

  public async showAllBooking() {
    const {BookingListComponent} = await import('../bookings-list/booking-list.component');
    this.sideDialogService.open(BookingListComponent);
  }

  public async showAllProducts() {
    const {ProductsComponent} = await import('../../pages/products/products.component');
    this.sideDialogService.open(ProductsComponent);
  }

  public async addProduct() {
    const {AddProductComponent} = await import('../add-product/add-product.component');
    this.sideDialogService.open(AddProductComponent);
  }

  public async showAllServices() {
    const {ServicesListComponent} = await import('../services-list/services-list.component');
    this.sideDialogService.open(ServicesListComponent);
  }

  public async addService() {
    const {AddServiceComponent} = await import('../add-service/add-service.component');
    this.sideDialogService.open(AddServiceComponent);
  }

  public async manageCategories() {
    const {ManageCategoriesComponent} = await import('../manage-categories/manage-categories.component');
    this.sideDialogService.open(ManageCategoriesComponent);
  }
}
