import {Component} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardActions, MatCardContent, MatCardImage} from '@angular/material/card';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-featured-products',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardContent,
    MatCardActions,
    NgForOf,
    MatButton,
    MatCardImage,
    CurrencyPipe,
  ],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent {
  public products = [
    {
      name: 'Shampoo',
      price: 12.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673713726/image/kgftnnqqz5cn1bje4di2.jpg',
      description: 'For smooth and shiny hair.',
    },
    {
      name: 'Conditioner',
      price: 14.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673710699/image/r69rcnaj4ibdawjovkwf.png',
      description: 'For soft and manageable hair.',
    },
    {
      name: 'Hair Mask',
      price: 19.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673714220/image/srnsoe8v6rntnuzuw0cp.jpg',
      description: 'Deep conditioning treatment.',
    },
    {
      name: 'Hair Oil',
      price: 9.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673706865/image/rc7narlv7f0zwnqzzbqq.jpg',
      description: 'For nourished and healthy hair.',
    },
    {
      name: 'Hair Serum',
      price: 15.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673710699/image/r69rcnaj4ibdawjovkwf.png',
      description: 'For frizz-free hair.',
    },
    {
      name: 'Hair Spray',
      price: 8.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673706865/image/rc7narlv7f0zwnqzzbqq.jpg',
      description: 'For long-lasting hold.',
    },
    {
      name: 'Hair Gel',
      price: 7.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673714220/image/srnsoe8v6rntnuzuw0cp.jpg',
      description: 'For strong styling.',
    },
    {
      name: 'Hair Wax',
      price: 10.99,
      image: 'https://res.cloudinary.com/dc9l6nzid/image/upload/v1673713726/image/kgftnnqqz5cn1bje4di2.jpg',
      description: 'For textured looks.',
    },
  ];

  public viewDetails(product: any) {
    console.log('View Details:', product);
    // Add logic to navigate to product details page
  }

  public addToCart(product: any) {
    console.log('Add to Cart:', product);
    // Add logic to add product to cart
  }
}
