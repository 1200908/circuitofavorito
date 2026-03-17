import {Component, OnInit, AfterViewInit, ElementRef, OnDestroy, NgZone, ChangeDetectorRef} from '@angular/core';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';
import { CtaComponent } from '../../layout/cta/cta';
import { PROJETOS } from '../../../data/projects';
import {Router, RouterLink, RouterLinkActive,} from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective, CtaComponent, RouterLink, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent implements AfterViewInit, OnInit, OnDestroy {

  projetos = PROJETOS;
  currentRoute: string = '';
  teaserIndex = 0;
  isChanging = false;
  isEntering = false;
  private teaserInterval: any;
  private teaserPauseTimeout: any;
  constructor(private elementRef: ElementRef, private router: Router, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.initCounterAnimation();

    gsap.registerPlugin(ScrollTrigger);

    // Teaser label — entra da esquerda
    gsap.fromTo('.teaser-label',
      { x: -60, rotation: -8, opacity: 0 },
      {
        x: 0, rotation: 0, opacity: 1,
        scrollTrigger: {
          trigger: '.teaser-left',
          start: 'top 80%',
          end: 'center 50%',
          scrub: true
        },
        ease: 'none'
      }
    );

// Teaser h2 — entra da direita
    gsap.fromTo('.teaser-left h2',
      { x: 60, rotation: 8, opacity: 0 },
      {
        x: 0, rotation: 0, opacity: 1,
        scrollTrigger: {
          trigger: '.teaser-left',
          start: 'top 80%',
          end: 'center 50%',
          scrub: true
        },
        ease: 'none'
      }
    );

// Teaser p — entra da esquerda mais suave
    gsap.fromTo('.teaser-left p',
      { x: -60, rotation: -8, opacity: 0 },
      {
        x: 0, rotation: 0, opacity: 1,
        scrollTrigger: {
          trigger: '.teaser-left',
          start: 'top 90%',
          end: 'top 30%',
          scrub: true
        },
        ease: 'none'
      }
    );
  }

  private initCounterAnimation(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-item');

          statItems.forEach((item, index) => {
            const numberElement = item.querySelector('.stat-number') as HTMLElement;

            if (numberElement) {
              const target = parseInt(numberElement.getAttribute('data-target') || '0');
              const duration = parseInt(numberElement.getAttribute('data-duration') || '2000');

              if (!isNaN(target)) {
                setTimeout(() => {
                  this.animateCounter(numberElement, target, duration);
                }, index * 200);
              }
            }
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const statsSection = this.elementRef.nativeElement.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  private animateCounter(element: HTMLElement, target: number, duration: number): void {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      element.textContent = current.toLocaleString('pt-PT');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = (element.classList.contains('plus') ? '+' : '') + target.toLocaleString('pt-PT');
      }
    };

    requestAnimationFrame(step);
  }

  goToProjects() {
    this.router.navigate(['/projetos']).then(() => {
      const el = document.querySelector('.projetos-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  projetoAtual(offset: number): any {
    const total = this.projetos.length;
    return this.projetos[(this.teaserIndex + offset) % total];
  }

  ngOnInit() {
    this.startTeaser();
  }

  ngOnDestroy() {
    clearInterval(this.teaserInterval);
    clearTimeout(this.teaserPauseTimeout);
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  startTeaser() {
    clearInterval(this.teaserInterval);

    this.ngZone.runOutsideAngular(() => {
      this.teaserInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.advanceTeaser();
        });
      }, 6000);
    });
  }
  advanceTeaser() {
    // 1. saída
    this.isChanging = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      // 2. muda o index e prepara entrada
      this.teaserIndex = (this.teaserIndex + 1) % this.projetos.length;
      this.isChanging = false;
      this.isEntering = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        // 3. entra
        this.isEntering = false;
        this.cdr.detectChanges();
      }, 50); // tick pequeno para o browser registar a posição inicial
    }, 350);
  }

  goToTeaser(index: number) {
    this.isChanging = true;
    this.cdr.detectChanges();
    clearInterval(this.teaserInterval);

    setTimeout(() => {
      this.teaserIndex = index;
      this.isChanging = false;
      this.isEntering = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.isEntering = false;
        this.cdr.detectChanges();
      }, 50);
    }, 350);

    this.teaserPauseTimeout = setTimeout(() => this.startTeaser(), 3000);
  }

  pauseTeaser() {
    clearInterval(this.teaserInterval);
  }

  resumeTeaser() {
    this.startTeaser();
  }


}
