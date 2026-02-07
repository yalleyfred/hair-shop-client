import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';

import {MatIcon} from '@angular/material/icon';
import {DialogService} from '../../service/dialog/dialog.service';

@Component({
  selector: 'app-hero',
  imports: [
    MatCardContent,
    MatCard,
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
      name: 'Cornrows',
      image: '/conrow.jpg',
    },
    {
      name: 'Faux Locs',
      image: '/faux%20locs.jpg',
    },
    {
      name: 'Pony',
      image: '/pony2.jpg',
    },
    {
      name: 'Rasta',
      image: '/rasta.jpg',
    },
    {
      name: 'Revamping',
      image: '/revamping4.jpg',
    },
    {
      name: 'Soft Locs',
      image: '/softlocs.jpg',
    },
    {
      name: 'Styling',
      image: '/styling.jpg',
    },
    {
      name: 'Twist',
      image: '/twist.jpg',
    },
  ];
  currentIndex = 2;
  visibleProducts: any = []
  visibleProductCount = 3;
  productAnimating = false;
  productAnimationDirection: 'next' | 'prev' | null = null;
  serviceIndex = 2;
  visibleServices: any = []
  visibleServiceCount = 3;
  serviceAnimating = false;
  serviceAnimationDirection: 'next' | 'prev' | null = null;
  private autoSlideTimerId?: number;
  private autoSlideDirection: 1 | -1 = 1;
  private productAutoSlideTimerId?: number;
  private productAutoSlideDirection: 1 | -1 = 1;

  @Input()
  public isAuthenticated: boolean = false;

  public sideDialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.visibleProductCount = this.getVisibleProductCount();
    this.currentIndex = Math.max(this.visibleProductCount - 1, 0);
    this.visibleProducts = this.products.slice(0, this.visibleProductCount);
    this.visibleServiceCount = this.getVisibleServiceCount();
    this.serviceIndex = Math.max(this.visibleServiceCount - 1, 0);
    this.visibleServices = this.services.slice(0, this.visibleServiceCount);
    console.log('visProd', this.visibleProducts);
    this.startAutoSlide();
    this.startProductAutoSlide();

  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.stopProductAutoSlide();
  }

  @HostListener('window:resize')
  public onWindowResize() {
    const nextProductCount = this.getVisibleProductCount();
    const nextCount = this.getVisibleServiceCount();
    if (nextProductCount !== this.visibleProductCount) {
      this.visibleProductCount = nextProductCount;
      this.currentIndex = Math.max(this.visibleProductCount - 1, 0);
      this.updateVisibleProducts();
    }
    if (nextCount !== this.visibleServiceCount) {
      this.visibleServiceCount = nextCount;
      this.serviceIndex = Math.max(this.visibleServiceCount - 1, 0);
      this.updateVisibleServices();
      this.cdr.markForCheck();
    }
  }

  public nextCard() {
    this.advanceProductPage(false, 'next');
  }

  public prevCard() {
    const prevIndex = this.currentIndex - this.visibleProductCount;
    if (prevIndex >= this.visibleProductCount - 1) {
      this.currentIndex = prevIndex;
      this.updateVisibleProducts();
      this.triggerProductAnimation('prev');
      return;
    }
    this.currentIndex = this.visibleProductCount - 1;
    this.updateVisibleProducts();
    this.triggerProductAnimation('prev');
  }

  public updateVisibleProducts() {
    this.visibleProducts = this.products.slice(
      this.currentIndex - (this.visibleProductCount - 1),
      this.currentIndex + 1
    );
    this.cdr.markForCheck();
  }

  private triggerProductAnimation(direction: 'next' | 'prev') {
    this.productAnimating = false;
    this.productAnimationDirection = direction;
    this.cdr.markForCheck();
    window.setTimeout(() => {
      this.productAnimating = true;
      this.cdr.markForCheck();
      window.setTimeout(() => {
        this.productAnimating = false;
        this.productAnimationDirection = null;
        this.cdr.markForCheck();
      }, 900);
    }, 0);
  }

  private advanceProductPage(wrap: boolean, direction: 'next' | 'prev') {
    const nextIndex = this.currentIndex + this.visibleProductCount;
    if (nextIndex < this.products.length) {
      this.currentIndex = nextIndex;
      this.updateVisibleProducts();
      this.triggerProductAnimation(direction);
      return;
    }
    if (wrap) {
      this.currentIndex = Math.max(this.visibleProductCount - 1, 0);
    } else {
      this.currentIndex = this.products.length - 1;
    }
    this.updateVisibleProducts();
    this.triggerProductAnimation(direction);
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

  private getVisibleProductCount(): number {
    const width = window?.innerWidth ?? 1024;
    const cardWidth = Math.min(320, Math.max(220, width * 0.3));
    const cardGap = 16;
    const gutters = 140;
    const available = Math.max(width - gutters, cardWidth);
    const count = Math.floor((available + cardGap) / (cardWidth + cardGap));
    return Math.max(1, Math.min(count, this.products.length));
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideTimerId = window.setInterval(() => {
      this.autoAdvanceService();
    }, 7000);
  }

  private startProductAutoSlide() {
    this.stopProductAutoSlide();
    this.productAutoSlideTimerId = window.setInterval(() => {
      this.autoAdvanceProduct();
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

  private autoAdvanceProduct() {
    const canAdvanceNext = this.currentIndex + this.visibleProductCount < this.products.length;
    const canAdvancePrev = this.currentIndex - this.visibleProductCount >= this.visibleProductCount - 1;

    if (this.productAutoSlideDirection === 1 && canAdvanceNext) {
      this.advanceProductPage(false, 'next');
      return;
    }

    if (this.productAutoSlideDirection === -1 && canAdvancePrev) {
      this.prevCard();
      return;
    }

    this.productAutoSlideDirection = this.productAutoSlideDirection === 1 ? -1 : 1;

    if (this.productAutoSlideDirection === 1 && canAdvanceNext) {
      this.advanceProductPage(false, 'next');
      return;
    }

    if (this.productAutoSlideDirection === -1 && canAdvancePrev) {
      this.prevCard();
      return;
    }

    this.advanceProductPage(true, 'next');
  }

  private stopAutoSlide() {
    if (this.autoSlideTimerId) {
      window.clearInterval(this.autoSlideTimerId);
      this.autoSlideTimerId = undefined;
    }
  }

  private stopProductAutoSlide() {
    if (this.productAutoSlideTimerId) {
      window.clearInterval(this.productAutoSlideTimerId);
      this.productAutoSlideTimerId = undefined;
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
