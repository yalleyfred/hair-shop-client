import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, Input, OnDestroy, OnInit} from '@angular/core';
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
export class HeroComponent implements OnInit, OnDestroy {
  public services = [
    {
      name: 'Butterfly Locs',
      description: 'Soft, airy locs with a light, boho bounce that frames the face.'
    },
    {
      name: 'Cornrows',
      description: 'Clean, sleek rows with sharp parts for a bold, polished finish.'
    },
    {
      name: 'Installation of Hair',
      description: 'Secure installs that blend naturally and stay flawless all day.'
    },
    {
      name: 'Soft Locs',
      description: 'Silky, flexible locs with a smooth sheen and natural movement.'
    },
    {
      name: 'Wig Sewing',
      description: 'Snug, comfortable sewing for a seamless, salon-ready look.'
    },
    {
      name: 'Pony',
      description: 'Chic pony styles with lift, volume, and a sleek finish.'
    },
    {
      name: 'Twist',
      description: 'Defined twists with clean lines and long-lasting shine.'
    },
    {
      name: 'Faux Locs',
      description: 'Textured, protective locs that deliver instant length and drama.'
    },
    {
      name: 'Revamping',
      description: 'Refresh and revive existing styles for a crisp, renewed look.'
    },
    {
      name: 'Rasta',
      description: 'Cultural-inspired locs with bold definition and deep texture.'
    },
    {
      name: 'Styling',
      description: 'Signature styling tailored to your face, vibe, and occasion.'
    }
  ];
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
  serviceIndex = 2;
  visibleServices: any = []
  visibleServiceCount = 3;
  serviceAnimating = false;
  serviceAnimationDirection: 'next' | 'prev' | null = null;
  private autoSlideTimerId?: number;
  private autoSlideDirection: 1 | -1 = 1;

  @Input()
  public isAuthenticated: boolean = false;

  public sideDialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.visibleProducts = this.products.slice(0, 3); // Show three cards at a time
    this.visibleServiceCount = this.getVisibleServiceCount();
    this.serviceIndex = Math.max(this.visibleServiceCount - 1, 0);
    this.visibleServices = this.services.slice(0, this.visibleServiceCount);
    console.log('visProd', this.visibleProducts);
    this.startAutoSlide();

  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  @HostListener('window:resize')
  public onWindowResize() {
    const nextCount = this.getVisibleServiceCount();
    if (nextCount !== this.visibleServiceCount) {
      this.visibleServiceCount = nextCount;
      this.serviceIndex = Math.max(this.visibleServiceCount - 1, 0);
      this.updateVisibleServices();
      this.cdr.markForCheck();
    }
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

  public nextService() {
    this.advanceServicePage(false, 'next');
  }

  public prevService() {
    const prevIndex = this.serviceIndex - this.visibleServiceCount;
    if (prevIndex >= this.visibleServiceCount - 1) {
      this.serviceIndex = prevIndex;
      this.updateVisibleServices();
      this.triggerServiceAnimation('prev');
      return;
    }
    this.serviceIndex = this.visibleServiceCount - 1;
    this.updateVisibleServices();
    this.triggerServiceAnimation('prev');
  }

  public updateVisibleServices() {
    this.visibleServices = this.services.slice(
      this.serviceIndex - (this.visibleServiceCount - 1),
      this.serviceIndex + 1
    );
    this.cdr.markForCheck();
  }

  private advanceServicePage(wrap: boolean, direction: 'next' | 'prev') {
    const nextIndex = this.serviceIndex + this.visibleServiceCount;
    if (nextIndex < this.services.length) {
      this.serviceIndex = nextIndex;
      this.updateVisibleServices();
      this.triggerServiceAnimation(direction);
      return;
    }
    if (wrap) {
      this.serviceIndex = Math.max(this.visibleServiceCount - 1, 0);
    } else {
      this.serviceIndex = this.services.length - 1;
    }
    this.updateVisibleServices();
    this.triggerServiceAnimation(direction);
  }

  private triggerServiceAnimation(direction: 'next' | 'prev') {
    this.serviceAnimating = false;
    this.serviceAnimationDirection = direction;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      this.serviceAnimating = true;
      this.cdr.markForCheck();
      window.setTimeout(() => {
        this.serviceAnimating = false;
        this.serviceAnimationDirection = null;
        this.cdr.markForCheck();
      }, 900);
    }, 0);
  }

  private getVisibleServiceCount(): number {
    const width = window?.innerWidth ?? 1024;
    const cardWidth = Math.min(320, Math.max(220, width * 0.28));
    const cardGap = 16;
    const gutters = 140;
    const available = Math.max(width - gutters, cardWidth);
    const count = Math.floor((available + cardGap) / (cardWidth + cardGap));
    return Math.max(1, Math.min(count, this.services.length));
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideTimerId = window.setInterval(() => {
      this.autoAdvanceService();
    }, 7000);
  }

  private autoAdvanceService() {
    const canAdvanceNext = this.serviceIndex + this.visibleServiceCount < this.services.length;
    const canAdvancePrev = this.serviceIndex - this.visibleServiceCount >= this.visibleServiceCount - 1;

    if (this.autoSlideDirection === 1 && canAdvanceNext) {
      this.advanceServicePage(false, 'next');
      return;
    }

    if (this.autoSlideDirection === -1 && canAdvancePrev) {
      this.prevService();
      return;
    }

    this.autoSlideDirection = this.autoSlideDirection === 1 ? -1 : 1;

    if (this.autoSlideDirection === 1 && canAdvanceNext) {
      this.advanceServicePage(false, 'next');
      return;
    }

    if (this.autoSlideDirection === -1 && canAdvancePrev) {
      this.prevService();
      return;
    }

    this.advanceServicePage(true, 'next');
  }

  private stopAutoSlide() {
    if (this.autoSlideTimerId) {
      window.clearInterval(this.autoSlideTimerId);
      this.autoSlideTimerId = undefined;
    }
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
