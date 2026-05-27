import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CampoAddestramento } from '../modelli/campo-addestramento.model';

@Injectable({ providedIn: 'root' })
export class CampoAddestramentoService {

  // Il campo usa il nome come chiave primaria (non un ID numerico)
  private apiUrl = 'http://localhost:8080/api/campi';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CampoAddestramento[]> {

    // usando i generics <CampoAddestramento[]> dico a TypeScript che appena arriva la risposta JSON dal server, 
    // deve essere mappata e considerata come un array di oggetti CampoAddestramento.
    return this.http.get<CampoAddestramento[]>(this.apiUrl);
  }

  getByNome(nome: string): Observable<CampoAddestramento> {
    return this.http.get<CampoAddestramento>(`${this.apiUrl}/${nome}`);
  }

  update(campo: CampoAddestramento): Observable<CampoAddestramento> {
    return this.http.put<CampoAddestramento>(
      `${this.apiUrl}/${campo.nome}`,
      campo
    );
  }

  delete(nome: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nome}`);
  }

  //crea un nuovo campo di addestramento
  create(campo: CampoAddestramento): Observable<CampoAddestramento> {
    return this.http.post<CampoAddestramento>(this.apiUrl, campo);
  }


}