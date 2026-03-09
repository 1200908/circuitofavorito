import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PROJETOS } from '../../../data/projects';
import {ProjetoDetalheComponent} from '../projeto-detalhe/projeto-detalhe';
import { CtaComponent } from '../../layout/cta/cta';

@Component({
  selector: 'app-projectos',
  imports: [CommonModule, RouterModule, FormsModule, CtaComponent],
  templateUrl: './projectos.html',
  styleUrl: './projectos.css',
})
export class ProjetosComponent implements OnInit {
  projetos = PROJETOS;
  filtered = [...PROJETOS];

  search = '';
  estadoAtivo: 'todos' | 'em-curso' | 'concluida' = 'todos';

  ngOnInit() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.filtered = this.projetos.filter(p => {
      const matchSearch =
        p.titulo.toLowerCase().includes(this.search.toLowerCase()) ||
        p.localizacao.toLowerCase().includes(this.search.toLowerCase());

      const matchEstado =
        this.estadoAtivo === 'todos' || p.estado === this.estadoAtivo;

      return matchSearch && matchEstado;
    });
  }

  setEstado(estado: 'todos' | 'em-curso' | 'concluida') {
    this.estadoAtivo = estado;
    this.aplicarFiltros();
  }

  get total() { return this.projetos.length; }
  get emCurso() { return this.projetos.filter(p => p.estado === 'em-curso').length; }
  get concluidas() { return this.projetos.filter(p => p.estado === 'concluida').length; }

  constructor(private router: Router) {}

  navigate(id: string | number) {
    this.router.navigate(['/projetos', id]);
  }
}
