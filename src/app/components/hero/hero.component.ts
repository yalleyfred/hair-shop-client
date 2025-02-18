import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

// import {a} from '../../../../public/r69rcnaj4ibdawjovkwf-Square.png'

@Component({
  selector: 'app-hero',
  imports: [
    MatCardContent,
    MatCard,
    MatCardActions,
    MatButton,
    NgForOf,
    MatIcon,
    MatIconButton,
    MatCardImage,
    RouterLink
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
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
    console.log('ind', this.currentIndex)
    if (this.currentIndex > 2) {
      this.currentIndex--;
      this.updateVisibleProducts();
    }
  }

  updateVisibleProducts() {
    this.visibleProducts = this.products.slice(
      this.currentIndex - 2,
      this.currentIndex + 1
    );
    console.log('here', this.visibleProducts);

  }
}
