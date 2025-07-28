import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para @if
import { Router, RouterModule } from '@angular/router'; // Para navegação
import { Auth } from '../../auth/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule 
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  tipoUsuario!: number; // Para usar no template

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.userRole$.subscribe(role => {
      this.tipoUsuario = Number(role) 
      this.redirectToAppropriatePage(); 
    });
  }

  redirectToAppropriatePage() {
    if (this.tipoUsuario) {
      if (this.tipoUsuario === 1) { // professor
        this.router.navigate(['/reservar-sala']);
      } else if (this.tipoUsuario === 3) { // admin
        this.router.navigate(['/reservas-pendentes']);
      } else if (this.tipoUsuario === 2) { // vigilante
        this.router.navigate(['/reservas-pendentes']);
      }
    }
  }
}