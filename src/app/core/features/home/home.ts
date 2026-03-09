import {Component, ElementRef, OnInit, ViewChild, NgZone, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import { CtaComponent } from '../../layout/cta/cta';
import { PROJETOS } from '../../../data/projects';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CtaComponent, CommonModule, RouterModule, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, AfterViewInit{

  projetos = PROJETOS;

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

  constructor(private ngZone: NgZone) {}

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
    const container = this.carousel.nativeElement;
    // scrollWidth: total do conteúdo, clientWidth: visível
    return Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;
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

    // Intervalo para mudar de slide
    setInterval(() => this.showNextSlide(), 5000);
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



}
