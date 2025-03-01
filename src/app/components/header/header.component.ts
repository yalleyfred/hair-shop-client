import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public isAuthenticated$: BehaviorSubject<boolean>;

  constructor(private readonly cdr: ChangeDetectorRef) {
    this.isAuthenticated$ = new BehaviorSubject(!!localStorage.getItem('user'));
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.isAuthenticated$.next(!!localStorage.getItem('user'));
    this.cdr.detectChanges();
    // this.isAuthenticated.update((_) => !!localStorage.getItem('user'))
  }

  // public login() {
  //
  // }

  ngOnInit(): void {
    // window.addEventListener('storage', (event) => {
    //   if (event.key === 'user') {
    //     console.log(localStorage.getItem('user'));
    //     this.isAuthenticated = !!localStorage.getItem('user');
    //   }
    // });
    // console.log('init')
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('here', changes);
  // }
}
