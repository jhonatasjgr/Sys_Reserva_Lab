import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export interface RouteData {
  roles?: number[];
}

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth); 
  const router = inject(Router);
  
  // Primeiro verifica se está logado
  if (!authService.estaLogado()) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica permissões de papel se especificadas na rota
  const allowedRoles = (route.data as RouteData)?.roles || [];
  
  // Se não há roles específicas definidas, permite acesso
  if (allowedRoles.length === 0) {
    return true;
  }

  const userRole = Number(authService.getTipoUsuario());
  
  // Verifica se o usuário tem um dos papéis permitidos
  if (allowedRoles.includes(userRole)) {
    return true;
  }

  // Se não tem permissão, mostra alerta e redireciona
  const roleNames = {
    1: 'Professor',
    2: 'Vigilante/Secretária',
    3: 'Administrador'
  };

  const requiredRoleNames = allowedRoles.map(role => roleNames[role as keyof typeof roleNames]).join(' ou ');
  const currentRoleName = roleNames[userRole as keyof typeof roleNames] || 'Desconhecido';

  Swal.fire({
    title: 'Acesso Negado',
    text: `Esta página é restrita para: ${requiredRoleNames}. Seu perfil atual: ${currentRoleName}`,
    icon: 'warning',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#3085d6'
  });

  router.navigate(['/dashboard']);
  return false;
};

// Constantes para facilitar o uso nas rotas
export const ROLES = {
  PROFESSOR: 1,
  VIGILANTE: 2,
  ADMINISTRADOR: 3
} as const;

// Tipos para TypeScript
export type UserRole = typeof ROLES[keyof typeof ROLES];
