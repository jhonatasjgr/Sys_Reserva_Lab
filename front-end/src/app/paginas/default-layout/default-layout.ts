import { Component, OnInit } from '@angular/core';
import { Auth } from '../../auth/services/auth';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Menu } from '../componentes/menu/menu';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    Menu],
})
export class DefaultLayout {
  papelUsuario: string | null = null; 

  constructor(private authService: Auth, private router: Router) {
    this.papelUsuario = this.authService.getTipoUsuario(); 
  }

  logout() {
    this.authService.logout(); 
  }
}
