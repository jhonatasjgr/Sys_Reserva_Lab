import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; 
import { CreateSalaDto, ReadSalaDto, Sala, TipoSalaModel, UpdateSalaDto } from '../model_enum/models';
import Swal from 'sweetalert2';

@Injectable({
 providedIn: 'root'
})
export class SalaService {
    private apiUrl = 'http://localhost:3000/salas'; 
    private tiposSalaApiUrl = 'http://localhost:3000/tipo-sala'; 

 constructor(private http: HttpClient) { }

 private handleError(error: HttpErrorResponse): Observable<never> {
  console.error('Erro na requisição da API de Salas:', error); 

  let errorMessage = 'Ocorreu um erro desconhecido ao carregar as salas.';

  if (error.error instanceof ErrorEvent) {
   errorMessage = `Erro do cliente: ${error.error.message}`;
  } else {
   switch (error.status) {
    case 404: // Not Found (ex: endpoint não existe ou não há salas)
     errorMessage = error.error?.message || 'Nenhuma sala encontrada ou endpoint inválido.';
     break;
    case 500: // Internal Server Error
     errorMessage = error.error?.message || 'Erro interno do servidor ao carregar salas. Tente novamente mais tarde.';
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



 
  createSala(dto: CreateSalaDto): Observable<ReadSalaDto> {
    return this.http.post<ReadSalaDto>(this.apiUrl, dto).pipe(
      tap(() => Swal.fire({
        title: 'Sala criada com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      })),
      catchError(this.handleError.bind(this))
    );
  }

  getSalas(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.apiUrl).pipe( 
    tap(salas => console.log('Salas carregadas com sucesso:', salas)), 
    catchError(this.handleError)
    );
  }
 

  getSalaById(id: number): Observable<ReadSalaDto> {
    return this.http.get<ReadSalaDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

 
  updateSala(id: number, dto: UpdateSalaDto): Observable<ReadSalaDto> {
    return this.http.patch<ReadSalaDto>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(() => Swal.fire({
        title: 'Sala atualizada com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      })),
      catchError(this.handleError.bind(this))
    );
  }


  deleteSala(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => Swal.fire({
        title: 'Sala removida com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      })),
      catchError(this.handleError.bind(this))
    );
  }

 
  getTiposSala(): Observable<TipoSalaModel[]> {
    return this.http.get<TipoSalaModel[]>(this.tiposSalaApiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}