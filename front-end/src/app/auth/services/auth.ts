import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importe HttpErrorResponse
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs'; // Importe catchError, throwError
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importado SweetAlert2

interface LoginResposta {
  tokenAcesso: string;
}

interface TokenDecodificado {
  userId: number; // ID do usuário (geralmente number)
  tipo: string;   // Tipo de usuário (ex: 'ADMINISTRADOR')
  username: string; // Nome de usuário
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth { // Mantendo o nome da classe como 'Auth'
  private apiUrl = 'http://localhost:3000/auth';
  private chaveToken = 'jwt_token';

  private papelUsuario = new BehaviorSubject<string | null>(null);
  userRole$ = this.papelUsuario.asObservable();

  // Injete o AlertaServiceTs
  constructor(private http: HttpClient, private router: Router) {
    this.carregarTokenPapelUsuario();
  }

  /**
   * NOVO: Método para tratar erros HTTP de forma centralizada.
   * Usará AlertaServiceTs para exibir mensagens.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro na autenticação.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro de conexão: ${error.error.message}`;
    } else if (error.status) {
      // Log para depuração:
      console.error('Erro HTTP completo (AuthService):', error);
      console.error('Corpo do erro da API (error.error):', error.error);
      
      // Tenta pegar a mensagem específica do backend
      const apiMessage = (error.error && typeof error.error === 'object' && 'message' in error.error)
                         ? (error.error as any).message
                         : null;

      if (error.status === 401) { // Unauthorized
        errorMessage = apiMessage || 'Credenciais inválidas. Verifique seu email e senha.';
      } else if (error.status === 403) { // Forbidden
        errorMessage = apiMessage || 'Acesso negado. Você não tem permissão.';
      } else {
        errorMessage = apiMessage || `Erro ${error.status}: ${error.statusText}`;
      }
    }

    Swal.fire({
      title: 'Erro de Autenticação',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return throwError(() => new Error(errorMessage));
  }


  private carregarTokenPapelUsuario() {
    const token = this.getToken();
    if (token){
      try{
          const decodificado = jwtDecode<TokenDecodificado>(token);
          console.log('Token decodificado:', decodificado);
          if(!this.isTokenExpirado(token)){
            this.papelUsuario.next(decodificado.tipo);
          }else{
            this.logout();
            Swal.fire({
              title: 'Sessão Expirada',
              text: 'Sua sessão expirou. Por favor, faça login novamente.',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          }
      }catch (error: any) {
        console.error('Erro ao decodificar o token JWT (em carregarTokenPapelUsuario):', error);
        Swal.fire({
          title: 'Erro ao Decodificar Token',
          text: 'Erro ao decodificar o token de sessão. Faça login novamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        if (error instanceof Error && error.name === 'InvalidTokenError') {
            this.logout(); 
        }
      }
    }
  }

  public login(email: string, senha: string): Observable<LoginResposta>{
    return this.http.post<LoginResposta>(`${this.apiUrl}/login`, { email, senha })
    .pipe(
      tap(resposta =>{
        localStorage.setItem(this.chaveToken, resposta.tokenAcesso);
        const decodificado = jwtDecode<TokenDecodificado>(resposta.tokenAcesso);
        this.papelUsuario.next(decodificado.tipo);
        Swal.fire({
          title: 'Login bem-sucedido!',
          text: `Bem-vindo, ${decodificado.username || 'usuário'}.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }),
      catchError(this.handleError.bind(this)) 
    )
  }

  public logout(): void {
    localStorage.removeItem(this.chaveToken);
    this.papelUsuario.next(null);
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Logout',
      text: 'Você foi desconectado.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  public getToken(): string | null {
    return localStorage.getItem(this.chaveToken);
  }

  public estaLogado(): boolean {
    const token = this.getToken();
    const logged = !!token && !this.isTokenExpirado(token);
    console.log('AuthService.estaLogado() - Token presente:', !!token, 'Expirado:', token ? this.isTokenExpirado(token) : 'N/A', 'Logado:', logged);
    return logged;
  }

  private isTokenExpirado(token: string): boolean {
    try{
      const decodificado = jwtDecode<TokenDecodificado>(token);
      const agora = Math.floor(Date.now() / 1000);
      const expirado = decodificado.exp < agora;
      console.log(`Token Exp: ${new Date(decodificado.exp * 1000).toLocaleString()}, Agora: ${new Date(agora * 1000).toLocaleString()}, Expirado: ${expirado}`);
      return expirado;
    }catch (error: any) { 
      console.error('Erro ao verificar se o token está expirado:', error);
      Swal.fire({
        title: 'Erro ao Verificar Token',
        text: 'Erro ao verificar validade do token. Faça login novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return true; 
    }
  }

  public getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodificado = jwtDecode<TokenDecodificado>(token);
        return decodificado.userId;
      } catch (error: any) {
        console.error('Erro ao decodificar o token JWT (em getUserId):', error);
        Swal.fire({
          title: 'Erro ao Obter ID do Usuário',
          text: 'Erro ao obter ID do usuário. Faça login novamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
    return null;
  }

  public getTipoUsuario(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodificado = jwtDecode<TokenDecodificado>(token);
        return decodificado.tipo;
      } catch (error: any) {
        console.error('Erro ao decodificar o token JWT (em getTipoUsuario):', error);
        Swal.fire({
          title: 'Erro ao Obter Tipo de Usuário',
          text: 'Erro ao obter tipo de usuário. Faça login novamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
    return null;
  }
}