import {Routes} from '@angular/router';
import {BookingComponent} from './pages/booking/booking.component';
import {ProductsComponent} from './pages/products/products.component';
import {HomeComponent} from './pages/home/home.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  // {path: 'home', component: HomeComponent},
  // {path: 'booking', component: BookingComponent},
  // {path: 'products', component: ProductsComponent},
  // {path: '', redirectTo: '/', pathMatch: 'full'}
];
