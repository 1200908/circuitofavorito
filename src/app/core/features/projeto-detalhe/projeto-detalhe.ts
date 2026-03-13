import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROJETOS } from '../../../data/projects';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CtaComponent } from '../../layout/cta/cta';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-projeto-detalhe',
  imports: [CommonModule, RouterModule, CtaComponent, ScrollRevealDirective],
  templateUrl: './projeto-detalhe.html',
  styleUrl: './projeto-detalhe.css',
})
export class ProjetoDetalheComponent implements OnInit, OnDestroy {

  projeto: any;
  currentIndex = 0;
  lightboxAberto = false;
  lightboxIndex = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private timer: any;


  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.projeto = PROJETOS.find(p => p.id === id);
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  get todasImagens(): string[] {
    return this.projeto?.imagens ?? (this.projeto?.imagem ? [this.projeto.imagem] : []);
  }

  private startTimer() {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      const total = this.todasImagens.length;
      if (total > 1) {
        this.currentIndex = (this.currentIndex + 1) % total;
        this.scrollToActive();
        this.cdr.detectChanges(); // força atualização da view
      }
    }, 3000);
  }

  selecionarThumb(index: number) {
    this.currentIndex = index;
    this.scrollToActive();
    clearInterval(this.timer);
    this.timer = setTimeout(() => {
      this.startTimer(); // reinicia autoplay
    }, 3000);
  }

  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  private scrollToActive() {
    if (!this.carousel) return;
    const container = this.carousel.nativeElement;
    const thumb = container.querySelector('.thumb-btn') as HTMLElement;
    if (!thumb) return;

    const thumbWidth = thumb.clientWidth;
    const gap = 10;
    const paddingLeft = 16; // 1rem = 16px
    const scrollLeft = this.currentIndex * (thumbWidth + gap) - paddingLeft;

    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
  }

  abrirLightbox(index: number) {
    this.lightboxIndex = index;
    this.currentIndex = index;
    this.lightboxAberto = true;
    clearInterval(this.timer); // pausa ao abrir lightbox
    document.body.style.overflow = 'hidden';
  }

  fecharLightbox() {
    this.lightboxAberto = false;
    document.body.style.overflow = '';
    this.startTimer(); // retoma ao fechar
  }

  navLightbox(direcao: 1 | -1) {
    const total = this.todasImagens.length;
    this.lightboxIndex = (this.lightboxIndex + direcao + total) % total;
    this.currentIndex = this.lightboxIndex;
    this.scrollToActive();
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  onTouchEnd(e: TouchEvent) {
    const diffX = this.touchStartX - e.changedTouches[0].screenX;
    const diffY = this.touchStartY - e.changedTouches[0].screenY;

    // só considera swipe se for movimento horizontal predominante
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      this.navLightbox(diffX > 0 ? 1 : -1);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (!this.lightboxAberto) return;
    if (e.key === 'Escape') this.fecharLightbox();
    if (e.key === 'ArrowRight') this.navLightbox(1);
    if (e.key === 'ArrowLeft') this.navLightbox(-1);
  }
}
