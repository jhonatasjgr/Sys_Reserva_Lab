import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {  UsuarioModel } from '../../model_enum/models'; 
import { UserService } from '../services/cadastrar'; 
import Swal from 'sweetalert2';

@Component({
 selector: 'app-cadastrar-usuario',
 templateUrl: './cadastrar-usuario.html',
 styleUrl: './cadastrar-usuario.scss',
 imports: [ 
    CommonModule,
  ReactiveFormsModule,
  RouterModule
 ],
  standalone: true 
})
export class CadastrarUsuario implements OnInit { 
form!: FormGroup;
 mensagemErro: string = '';
 mensagemSucesso: string = '';
 usuario: UsuarioModel | null = null; 

 private TIPO_USUARIO_ID_PROFESSOR = 1; 
 constructor(
  private fb: FormBuilder,
  private userService: UserService, 
  private router: Router
 ) {
 }

  ngOnInit(): void {
    this.userService.getTiposUsuario().subscribe(
      usuarios => {
        this.TIPO_USUARIO_ID_PROFESSOR = usuarios.find(usuario => usuario.nome === 'PROFESSOR')?.id || 1; 
      }
    );

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      tipo_usuarioId: [1, Validators.required]
    });
  }

 submit() {
  this.mensagemErro = '';
  this.mensagemSucesso = '';
  
  if (this.form.invalid) {
      this.form.markAllAsTouched(); 
   this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      this.mensagemSucesso = ''; 
   return;
  }

    const novoUsuarioPayload: any = this.form.value;

  this.userService.register(novoUsuarioPayload).subscribe({
   next: (responseUsuario: UsuarioModel) => { 
    this.usuario = responseUsuario; 

    Swal.fire({
      title: 'Usuário Registrado com Sucesso!',
      text: `Bem-vindo, ${this.usuario.nome}!`,
      icon: 'success',
      confirmButtonText: 'OK'
    });

    this.form.reset({ tipo_usuarioId: this.TIPO_USUARIO_ID_PROFESSOR }); 
    this.router.navigate(['/login']); 
   },
   error: (error: any) => { 
    Swal.fire({
      title: 'Erro ao Registrar Usuário',
      text: error || 'Erro ao registrar usuário. Tente novamente.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    this.mensagemErro = error || 'Erro ao registrar usuário. Tente novamente.';
    this.mensagemSucesso = ''; 
   }
  });
 }
}