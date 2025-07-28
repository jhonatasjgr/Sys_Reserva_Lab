import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Usuario {

  private apiUrl = 'http://localhost:3000/usuarios'; 
  private apiUrlTipoUsuario = 'http://localhost:3000/tipo-usuario'; 
  constructor(private http: HttpClient) { }


  public getUsuario(idUsuario: number) {
    return this.http.get(`${this.apiUrl}/${idUsuario}`);
  }

  public getTipoUsuario() {
    return this.http.get(this.apiUrlTipoUsuario);
  }

   getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  updateUser(id: number, dto: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido ao processar sua solicitação de usuário.';
    if (error.error instanceof ErrorEvent) { errorMessage = `Erro de conexão: ${error.error.message}`; }
    else if (error.status) {
      errorMessage = `Erro ${error.status}: ${error.error?.message || error.statusText}`;
      if (error.status === 409) { errorMessage = error.error?.message || 'O registro já existe. Por favor, verifique os dados.'; }
      else if (error.status === 400) { errorMessage = error.error?.message || 'Dados inválidos. Verifique as informações fornecidas.'; }
      else if (error.status === 404) { errorMessage = error.error?.message || 'O usuário não foi encontrado.'; }
      else if (error.status === 401 || error.status === 403) { errorMessage = error.error?.message || 'Você não tem permissão para realizar esta ação.'; }
    }
    console.error('Erro no UserService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
