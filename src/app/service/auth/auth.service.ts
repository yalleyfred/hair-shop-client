import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {endpoint} from '../../constants/constant';
import {Router} from '@angular/router';
import {Auth} from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public errorMessage = '';

  constructor(public http: HttpClient, public router: Router) {
  }

  public login(loginDto: Auth) {
    return this.http.post(`${endpoint}/auth/login`, loginDto).subscribe((res: any) => {
        console.log('response', res);
        localStorage.setItem('user', res.access_token);
        this.router.navigate(['/'])
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    )
  }
}
