import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { HomeComponent } from './core/features/home/home';
import { AboutComponent } from './core/features/about/about';
import { ContactComponent } from './core/features/contact/contact';
import { ProjetoDetalheComponent } from './core/features/projeto-detalhe/projeto-detalhe';
import { ProjetosComponent } from './core/features/projectos/projectos';



export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'projetos/:id', component: ProjetoDetalheComponent },
      { path: 'projetos', component: ProjetosComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
