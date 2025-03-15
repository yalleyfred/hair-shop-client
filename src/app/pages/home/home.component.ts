import {ChangeDetectionStrategy, Component} from '@angular/core';
import {HeroComponent} from '../../components/hero/hero.component';
import {FeaturedProductsComponent} from '../../components/featured-products/featured-products.component';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    FeaturedProductsComponent,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  public isAuthenticated: boolean = !!localStorage.getItem('user');

}
