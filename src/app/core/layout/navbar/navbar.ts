import { Component, HostListener } from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  currentRoute: string = '';
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  isNavbarHidden = false;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      // Scroll para baixo → esconde navbar
      this.isNavbarHidden = true;
    } else {
      // Scroll para cima → mostra navbar
      this.isNavbarHidden = false;
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }


  goToHome() {
    this.router.navigate(['/home']).then(() => {
      const el = document.querySelector('.hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
  goToAbout() {
    this.router.navigate(['/about']).then(() => {
      const el = document.querySelector('.about-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToProgramacao() {
    this.router.navigate(['/programacao']).then(() => {
      const el = document.querySelector('.programacao-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToGuia() {
    this.router.navigate(['/guia-turistico']).then(() => {
      const el = document.querySelector('.guia-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToContact() {
    this.router.navigate(['/contact']).then(() => {
      const el = document.querySelector('.contact-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToProjects() {
    this.router.navigate(['/projetos']).then(() => {
      const el = document.querySelector('.projetos-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
}
