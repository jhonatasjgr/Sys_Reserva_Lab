import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
   @Output() logoutEvent = new EventEmitter<void>();

  estaExpansivel: boolean = true;
  tipoUsuario: number | null = null; 
  constructor(private authService: Auth) {
    this.authService.userRole$.subscribe(role => {
      this.tipoUsuario = Number(role);
    });
  }

  toggleMenu() {
    this.estaExpansivel = !this.estaExpansivel;
  }

  logout() {
    this.logoutEvent.emit();
  }
}
