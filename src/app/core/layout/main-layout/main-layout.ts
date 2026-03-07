import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {}
