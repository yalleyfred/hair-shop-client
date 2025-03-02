import {
  ChangeDetectionStrategy,
  Component, EventEmitter, inject, Input,
  Output,
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  @Input()
  public isAuthenticated: boolean = false;

  @Output()
  public authenticatedChange: EventEmitter<boolean> = new EventEmitter();

  public router = inject(Router)


  public logout(): void {
    localStorage.removeItem('user');
    this.isAuthenticated = !!localStorage.getItem('user');
    this.authenticatedChange.emit(this.isAuthenticated);
    this.router.navigate(['login']);
  }

}
