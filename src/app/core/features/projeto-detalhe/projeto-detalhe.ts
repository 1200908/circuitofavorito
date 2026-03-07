import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROJETOS } from '../../../data/projects';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CtaComponent} from '../../layout/cta/cta';

@Component({
  selector: 'app-projeto-detalhe',
  imports: [CommonModule,RouterModule, CtaComponent],
  templateUrl: './projeto-detalhe.html',
  styleUrl: './projeto-detalhe.css',
})
export class ProjetoDetalheComponent implements OnInit {

  projeto: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.projeto = PROJETOS.find(p => p.id === id);
  }

}
