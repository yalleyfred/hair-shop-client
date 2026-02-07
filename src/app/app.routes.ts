import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)},
  {path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
