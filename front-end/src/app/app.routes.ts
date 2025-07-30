import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { CadastrarUsuario } from './auth/cadastrar-usuario/cadastrar-usuario';
import { DefaultLayout } from './paginas/default-layout/default-layout';
import { DashboardComponent } from './paginas/dashboard/dashboard';
import { ReservarSala } from './paginas/reservar-sala/reservar-sala';
import { GerenciarReservas } from './paginas/reservas-pendentes/gerenciar-reservas';
import { authGuardGuard, ROLES } from './auth/guard/auth-guard-guard';
import { ReservasEmAndamento } from './paginas/reservas-em-andamento/reservas-em-andamento';
import { HistoricoReservas } from './paginas/historico-reservas/historico-reservas';
import { MinhasReservasAtivas } from './paginas/minhas-reservas-ativas/minhas-reservas-ativas';
import { MinhasReservasHistorico } from './paginas/minhas-reservas-historico/minhas-reservas-historico';
import { CriarSala } from './paginas/criar-sala/criar-sala';
import { GerenciarUsuarios } from './paginas/gerenciar-usuarios/gerenciar-usuarios';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastrarUsuario', component: CadastrarUsuario },
  {
    path: '', 
    component: DefaultLayout,
    canActivate: [authGuardGuard], 
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuardGuard]
      },

      { 
        path: 'reservar-sala', 
        component: ReservarSala,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.PROFESSOR] }
      },
      { 
        path: 'minhas-reservas', 
        component: MinhasReservasAtivas,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.PROFESSOR] }
      },
      { 
        path: 'historico-minhas-reservas', 
        component: MinhasReservasHistorico,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.PROFESSOR] }
      },

      { 
        path: 'reservas-pendentes', 
        component: GerenciarReservas,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.VIGILANTE, ROLES.ADMINISTRADOR] }
      },
      { 
        path: 'reservas-em-andamento', 
        component: ReservasEmAndamento,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.VIGILANTE, ROLES.ADMINISTRADOR] }
      },
      { 
        path: 'reservas-encerradas', 
        component: HistoricoReservas,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.VIGILANTE, ROLES.ADMINISTRADOR] }
      },

      { 
        path: 'criar-sala', 
        component: CriarSala,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.ADMINISTRADOR] }
      },
      { 
        path: 'gerenciar-usuarios', 
        component: GerenciarUsuarios,
        canActivate: [authGuardGuard],
        data: { roles: [ROLES.ADMINISTRADOR] }
      },
    ]
  },
  
  { path: '**', redirectTo: 'login' },
];