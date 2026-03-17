import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NgZone,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CtaComponent } from '../../layout/cta/cta';
import { PROJETOS } from '../../../data/projects';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CtaComponent, CommonModule, RouterModule, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy{

  projetos = PROJETOS;
  currentRoute: string = '';

  @ViewChild('carousel', { static: true }) carousel!: ElementRef<HTMLDivElement>;
  private autoStepInterval: any;
  private pauseTimeout: any;
  scrollLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateScroll();
      this.pauseAutoStep(); // pausa o auto-scroll por 2s
    }
  }

  scrollRight() {
    if (this.currentIndex < this.projetos.length - 1) {
      this.currentIndex++;
      this.updateScroll();
      this.pauseAutoStep(); // pausa o auto-scroll por 2s
    }
  }

  onScroll() {
    this.pauseAutoStep(); // pausa o auto-scroll 2s sempre que o usuário mexe no scroll
  }
// método para centralizar o card ativo
  updateScroll() {
    const container = this.carousel.nativeElement;
    const cardWidth = container.querySelector('.project-card')?.clientWidth ?? 160;
    const gap = 10;
    const scrollLeft = this.currentIndex * (cardWidth + gap);
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }

  currentIndex = 0;

  constructor(private ngZone: NgZone, private router: Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit() {
    this.startAutoStep();
  }

  pauseAutoStep() {
    clearInterval(this.autoStepInterval); // para o auto-scroll atual
    clearTimeout(this.pauseTimeout);      // limpa timeout anterior

    this.pauseTimeout = setTimeout(() => {
      this.startAutoStep();               // reinicia auto-scroll após 2s
    }, 2000);
  }

  startAutoStep() {
    clearInterval(this.autoStepInterval);
    const container = this.carousel.nativeElement;
    const cardWidth = container.querySelector('.project-card')?.clientWidth ?? 160;
    const gap = 10; // gap entre cards


    this.autoStepInterval = setInterval(() => {
      this.ngZone.run(() => {   // <- importante para Angular detectar mudanças
        if (this.currentIndex < this.projetos.length - 1) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }



        const scrollLeft = this.currentIndex * (cardWidth + gap);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      });
    }, 2000);

  }

  goToCard(index: number) {
    this.currentIndex = index;
    this.updateScroll();
    this.pauseAutoStep(); // pausa auto-scroll
  }

  isAtStart(): boolean {
    return this.carousel.nativeElement.scrollLeft === 0;
  }
  isAtEnd(): boolean {
    return this.currentIndex === this.projetos.length - 1;
  }

  @ViewChildren('slides') slides!: QueryList<ElementRef<HTMLElement>>;
  heroSlideIndex  = 0;
  ngAfterViewInit(): void {
    const first = this.slides.toArray()[this.heroSlideIndex].nativeElement;
    first.classList.add('active');

    // Se for vídeo, força o play
    if (first.tagName === 'VIDEO') {
      const video = first as HTMLVideoElement;
      video.muted = true; // precisa estar muted
      video.play().catch(() => {
        // fallback caso autoplay falhe
        console.log('Vídeo autoplay bloqueado, aguardando interação do usuário.');
      });
    }

    setInterval(() => this.showNextSlide(), 5000);

    const mm = gsap.matchMedia();
    gsap.registerPlugin(ScrollTrigger);


    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-welcome', { yPercent: 120, duration: 0.7 })
      .from('.hero-brand',   { yPercent: 120, duration: 0.9 }, '-=0.5')
      .from('.hero-slider',  { scale: 1.1, opacity: 0, duration: 1.4 }, '-=0.8')
      .from('.scroll-hint',  { opacity: 0, y: 10, duration: 0.6 }, '-=0.2');

    gsap.to('.hero-welcome', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      rotation: -8,
      x: -40,
      opacity: 0,
      ease: 'none'
    });

    gsap.to('.hero-brand', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      rotation: 8,       // roda ao contrário do welcome
      x: 40,
      opacity: 0,
      ease: 'none'
    });
  // Slider encolhe e sobe ao scrollar — efeito profissional
    gsap.to('.hero-slider', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      scale: 0.88,
      y: -60,
      borderRadius: '24px',
      ease: 'none'
    });

// Título sobe mais rápido que o slider — parallax
    gsap.to('.hero-content h1', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: -80,
      ease: 'none'
    });

    gsap.fromTo('.hero-content p',
      { y: 20, opacity: 1, filter: 'blur(0px)' },  // estado inicial
      {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        },
        y: 40,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'none'
      }
    );

    gsap.to('.scroll-hint', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=200',        // nos primeiros 200px de scroll
        scrub: true          // liga diretamente ao scroll
      },
      opacity: 0,
      y: 20,                 // cai ligeiramente para baixo
      ease: 'none'
    });

    gsap.fromTo('.about-left p',
        { x: -60, rotation: -8, opacity: 0 },   // estado inicial (fora do ecrã)
        {
          x: 0, rotation: 0, opacity: 1,         // estado do meio (visível)
          scrollTrigger: {
            trigger: '.about-teaser',
            start: 'top 90%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'none'
        }
      );

// Imagem entra da direita
    gsap.from('.about-right img', {
      scrollTrigger: {
        trigger: '.about-teaser',
        start: 'top 75%',
      },
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.to('.about-right img', {
      scrollTrigger: {
        trigger: '.about-teaser',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: -80,
      ease: 'none'
    });

    gsap.to('.about-badge', {
      scrollTrigger: {
        trigger: '.about-teaser',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -140,
      x: 60,
      rotation: 15,
      ease: 'none'
    });

    gsap.to('.about-left', {
      scrollTrigger: {
        trigger: '.about-teaser',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: -30,
      ease: 'none'
    });

    gsap.fromTo('.about-label',
      { x: -60, rotation: -8, opacity: 0 },   // estado inicial (fora do ecrã)
      {
        x: 0, rotation: 0, opacity: 1,         // estado do meio (visível)
        scrollTrigger: {
          trigger: '.about-teaser',
          start: 'top 80%',
          end: 'center 80%',                // ← só entra até ao centro
          scrub: true
        },
        ease: 'none'
      }
    );


// About h2 — entra da direita, fica, sai para a esquerda
    gsap.fromTo('.about-left h2',
      { x: 60, rotation: 8, opacity: 0 },
      {
        x: 0, rotation: 0, opacity: 1,
        scrollTrigger: {
          trigger: '.about-teaser',
          start: 'top 80%',
          end: 'center 80%',
          scrub: true
        },
        ease: 'none'
      }
    );


    mm.add("(min-width: 769px)", () => {
      gsap.fromTo('.hero-slider',
        { scale: 1 },           // ← começa exatamente em 1, sem esticar
        {
          scale: 0.88,
          y: -60,
          borderRadius: '24px',
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

  }

  showNextSlide() {
    const slidesArray = this.slides.toArray();
    // Remove active da atual
    slidesArray[this.heroSlideIndex ].nativeElement.classList.remove('active');

    // Próximo slide
    this.heroSlideIndex  = (this.heroSlideIndex  + 1) % slidesArray.length;

    // Adiciona active à próxima
    slidesArray[this.heroSlideIndex ].nativeElement.classList.add('active');
  }

  goToAbout() {
    this.router.navigate(['/about']).then(() => {
      const el = document.querySelector('.page-background');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }


}
