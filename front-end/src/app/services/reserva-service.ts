import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { CreateReservaDto, ReadAvailabilityDto, ReservaModel, UpdateReservaDto } from '../model_enum/models';
import { map, Observable, tap, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';

@Injectable({
 providedIn: 'root',
})
export class ReservaService {
 private apiUrl = 'http://localhost:3000/reservas'; 
 private apiUrlStatus = 'http://localhost:3000/status-reserva'; 

 constructor(private http: HttpClient) {}

 private handleError(error: HttpErrorResponse): Observable<never> {
  console.error('Erro na requisição da API de Reservas:', error); 

  let errorMessage = 'Ocorreu um erro desconhecido.';
  
  if (error.error instanceof ErrorEvent) {
   errorMessage = `Erro do cliente: ${error.error.message}`;
  } else {
   switch (error.status) {
    case 400: 
     errorMessage = error.error?.message || 'Dados inválidos na requisição.';
     break;
    case 401: // Unauthorized
     errorMessage = error.error?.message || 'Não autorizado. Por favor, faça login novamente.';
     break;
    case 403: // Forbidden
     errorMessage = error.error?.message || 'Acesso negado. Você não tem permissão para esta ação.';
     break;
    case 404: // Not Found
     errorMessage = error.error?.message || 'Recurso não encontrado.';
     break;
    case 409: // Conflict
     errorMessage = error.error?.message || 'Conflito de dados (ex: horário indisponível, email já cadastrado).';
     break;
    case 500: // Internal Server Error
     errorMessage = error.error?.message || 'Erro interno do servidor. Tente novamente mais tarde.';
     break;
    default:
     errorMessage = `Erro do servidor: ${error.status} - ${error.statusText || 'Erro desconhecido'}`;
     if (error.error?.message) {
      errorMessage += `: ${error.error.message}`;
     }
     break;
   }
  }
  return throwError(() => new Error(errorMessage));
 }

 createReserva(dto: CreateReservaDto): Observable<ReservaModel> {
  return this.http.post<ReservaModel>(this.apiUrl, dto).pipe(
   tap(response => console.log('Reserva criada com sucesso:', response)),
   catchError(this.handleError) 
  );
 }

 public getReservasPendentes(): Observable<ReservaModel[]> {
  return this.http.get<ReservaModel[]>(`${this.apiUrl}/reservas-pendentes`).pipe(
   tap(reservas => console.log('Dados de reservas pendentes recebidos:', reservas)),
   catchError(this.handleError) 
  );
 }

 public getReservasEMAndamento():Observable<ReservaModel[]>{
 return this.http.get<ReservaModel[]>(`${this.apiUrl}/reservas-em-andamento`).pipe(
   tap(reservas => console.log('Dados de reservas em andamento recebidos:', reservas)), // Ajuste o log para refletir o que é
   catchError(this.handleError) 
  );
 }

   getMinhasReservasAtivas(usuarioId: number): Observable<ReservaModel[]> {
      return this.http.get<ReservaModel[]>(`${this.apiUrl}/reservas-ativas`, {
        params: { usuarioId: usuarioId}
      }).pipe(
        tap(reservas => console.log(`Reservas ativas do jhonatas ${usuarioId} recebidas:`, reservas)),
        catchError(this.handleError) 
      );
   }

   public getMinhasReservasPassadas(usuarioId: number, pagina: number = 1, limite: number = 10): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('limite', limite.toString());

   
    return this.http.get<any>(`${this.apiUrl}/minhas-reservas`, { params }).pipe(
      map(response => ({
        ...response,
        data: response.data.map((reserva:any) => ({
          ...reserva,
          dataInicio: new Date(reserva.dataInicio),
          dataFim: new Date(reserva.dataFim)
        }))
      })),
      tap(response => console.log(`Minhas reservas passadas do usuário ${usuarioId} paginadas recebidas:`, response)),
      catchError(this.handleError.bind(this))
    );
  }


 update(id: number, dto: UpdateReservaDto): Observable<ReservaModel> {
  return this.http.patch<ReservaModel>(`${this.apiUrl}/${id}`, dto).pipe(
   tap(response => console.log(`Reserva ${id} atualizada com sucesso:`, response)),
   catchError(this.handleError) 
  );
 }

 public getAll(pagina: number = 1, limite: number = 10): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString()); 
    params = params.append('limite', limite.toString()); 

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        ...response,
        data: response.data.map((reserva:any) => ({
          ...reserva,
          dataInicio: new Date(reserva.dataInicio),
          dataFim: new Date(reserva.dataFim)
        }))
      })),
      tap(response => console.log('Todas as reservas paginadas recebidas:', response)),
      catchError(this.handleError.bind(this))
    );
  }

 public getStatusReserva(): Observable<any> {
  return this.http.get<string>(`${this.apiUrlStatus}`).pipe(
   tap(status => console.log(`Status da reserva:`, status)),
   catchError(this.handleError) 
  );
 }
}