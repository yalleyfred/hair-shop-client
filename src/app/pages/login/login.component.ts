import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../service/auth/auth.service';
import {authDto} from '../../models/auth.model';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatIcon,
    RouterLink,
    // NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public loginData: authDto = {
    email: '',
    password: ''
  }
  public authService = inject(AuthService)
  public errorMessage = this.authService.errorMessage;

  public imageUrl = '/assets/hair-logo.png';

  public submit() {
    return this.authService.login(this.loginData);
  }
}
