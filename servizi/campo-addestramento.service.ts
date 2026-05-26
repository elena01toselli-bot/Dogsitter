// src/app/servizi/campo-addestramento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CampoAddestramento } from '../modelli/campo-addestramento.model';

@Injectable({ providedIn: 'root' })
export class CampoAddestramentoService {

  private apiUrl = 'http://localhost:8080/api/campi';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CampoAddestramento[]> {
    return this.http.get<CampoAddestramento[]>(this.apiUrl);
  }

  getByNome(nome: string): Observable<CampoAddestramento> {
    return this.http.get<CampoAddestramento>(`${this.apiUrl}/${encodeURIComponent(nome)}`);
  }

  create(campo: CampoAddestramento): Observable<CampoAddestramento> {
    return this.http.post<CampoAddestramento>(this.apiUrl, campo);
  }

  update(campo: CampoAddestramento): Observable<CampoAddestramento> {
    return this.http.put<CampoAddestramento>(`${this.apiUrl}/${encodeURIComponent(campo.nome)}`, campo);
  }

  delete(nome: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(nome)}`);
  }
}
