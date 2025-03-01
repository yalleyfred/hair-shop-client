import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../service/auth/auth.service';
import {authDto} from '../../models/auth.model';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginData: authDto = {
    email: '',
    password: ''
  }
  public authService = inject(AuthService)
  public errorMessage = this.authService.errorMessage;

  public submit() {
    return this.authService.login(this.loginData);
  }
}
