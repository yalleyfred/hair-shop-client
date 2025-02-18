import { Component } from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  public pages = ['book appointment', 'products']
}
