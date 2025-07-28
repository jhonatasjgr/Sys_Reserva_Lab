import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UsuarioModel } from '../../model_enum/models';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/usuarios'; 
  private apiUrlTipoUsuario = 'http://localhost:3000/tipo-usuario'; 

  constructor(private http: HttpClient) {}

 register(dto: any): Observable<UsuarioModel> {
     return this.http.post<UsuarioModel>(this.apiUrl, dto).pipe(
      tap(() => {
        Swal.fire({
          title: 'Usuário registrado com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }),
      catchError(this.handleError.bind(this)) 
    );
  }

  getTiposUsuario(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlTipoUsuario).pipe(
      catchError(this.handleError.bind(this))
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido ao processar sua solicitação de usuário.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro de conexão: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Erro ${error.status}: ${error.error?.message || error.statusText}`;
      if (error.status === 409) { //  email já existe
        errorMessage = error.error?.message || 'O registro já existe. Por favor, verifique os dados.';
      } else if (error.status === 400) { // erro de validação
        errorMessage = error.error?.message || 'Dados inválidos. Verifique as informações fornecidas.';
      } else if (error.status === 404) { // não encontrado
        errorMessage = error.error?.message || 'O usuário não foi encontrado.';
      } else if (error.status === 401 || error.status === 403) { // Não autorizado / Proibido
        errorMessage = error.error?.message || 'Você não tem permissão para realizar esta ação.';
      }
    }
    console.error('Erro no UserService:', error);
    Swal.fire({
      title: 'Erro',
      text: `Erro: ${errorMessage}`,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return throwError(() => new Error(errorMessage));
  }
}