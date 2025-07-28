import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth); 
  const router = inject(Router);     
    
  if (authService.estaLogado()) {
    Swal.fire({
      title: 'AuthGuard: Usuário está logado.',
      text: 'Acesso permitido.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    return true; 
  } else {
    Swal.fire({
      title: 'AuthGuard: Usuário NÃO está logado.',
      text: 'Redirecionando para /login.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return router.createUrlTree(['/login']); 
  }
};
