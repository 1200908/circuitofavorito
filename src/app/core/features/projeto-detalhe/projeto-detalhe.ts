import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROJETOS } from '../../../data/projects';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CtaComponent } from '../../layout/cta/cta';

@Component({
  selector: 'app-projeto-detalhe',
  imports: [CommonModule, RouterModule, CtaComponent],
  templateUrl: './projeto-detalhe.html',
  styleUrl: './projeto-detalhe.css',
})
export class ProjetoDetalheComponent implements OnInit {

  projeto: any;
  lightboxAberto: boolean = false;
  lightboxIndex: number = 0;
  private touchStartX: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.projeto = PROJETOS.find(p => p.id === id);
  }

  get todasImagens(): string[] {
    return this.projeto?.imagens ?? (this.projeto?.imagem ? [this.projeto.imagem] : []);
  }

  abrirLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxAberto = true;
    document.body.style.overflow = 'hidden';
  }

  fecharLightbox() {
    this.lightboxAberto = false;
    document.body.style.overflow = '';
  }

  navLightbox(direcao: 1 | -1) {
    const total = this.todasImagens.length;
    this.lightboxIndex = (this.lightboxIndex + direcao + total) % total;
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent) {
    const diff = this.touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      this.navLightbox(diff > 0 ? 1 : -1);
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
