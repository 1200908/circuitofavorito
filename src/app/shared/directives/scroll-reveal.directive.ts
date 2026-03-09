import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // espera o Angular renderizar o elemento
    setTimeout(() => {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            obs.unobserve(entry.target); // só anima uma vez
          }
        });
      }, { threshold: 0.1 });

      observer.observe(this.el.nativeElement);
    }, 0);
  }
}
