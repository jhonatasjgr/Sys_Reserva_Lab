import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class Login {

  loginForm: FormGroup;

  errorMensagem: string = '';

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: Auth,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    this.errorMensagem = '';
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      try {
       this.authService.login(email, senha).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Login bem-sucedido!',
              text: 'Bem-vindo de volta!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/dashboard']);
          },
          (error: any) => {
            Swal.fire({
              title: 'Erro de Login',
              text: error.message || 'Erro ao fazer login. Verifique suas credenciais.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
       );
      } catch (error) {
        
        this.errorMensagem = 'Erro ao processar o login. Por favor, tente novamente.';
        Swal.fire({
          title: 'Erro de Login',
          text: this.errorMensagem,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.errorMensagem = 'Por favor, preencha todos os campos corretamente.';
      Swal.fire({
        title: 'Erro de Validação',
        text: this.errorMensagem,
        icon: 'error',
        confirmButtonText: 'OK'
      });

    }
  }


}
