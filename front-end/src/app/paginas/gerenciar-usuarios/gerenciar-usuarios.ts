import { Component } from '@angular/core';
import { UsuarioModel } from '../../model_enum/models';
import { UserService } from '../../auth/services/cadastrar';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../services/usuario';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerenciar-usuarios',
  imports: [CommonModule,
    RouterModule ],
  templateUrl: 'gerenciar-usuarios.html',
  styleUrl: './gerenciar-usuarios.scss'
})
export class GerenciarUsuarios {
 usuarios: UsuarioModel[] = [];

  usuarioLogado!: number | any; 
  

  constructor(
    private userService: Usuario,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.auth.getUserId()    
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.userService.getAllUsers().subscribe({
      next: (data: UsuarioModel[]) => {
        this.usuarios = data.map(user => ({
            ...user,
        }));
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Carregar Usuários',
          text: 'Ocorreu um erro ao carregar a lista de usuários.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  toggleStatusUsuario(usuarioId: number, statusAtual: boolean) {
    const novoStatus = !statusAtual; 
    const updateDto: any = { status: novoStatus };

    this.userService.updateUser(usuarioId, updateDto).subscribe({
      next: (usuarioAtualizado: UsuarioModel) => {
        Swal.fire({
          title: 'Sucesso!',
          text: `Usuário ${usuarioAtualizado.nome} ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.carregarUsuarios();
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Alterar Status',
          text: 'Ocorreu um erro ao alterar o status do usuário.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
