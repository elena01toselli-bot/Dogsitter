// src/app/servizi/lezione.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lezione } from '../modelli/lezioni.model';

@Injectable({ providedIn: 'root' })
export class LezioneService {

  private apiUrl = 'http://localhost:8080/api/lezioni';

  constructor(private http: HttpClient) {}

  getByCampo(nomeCampo: string): Observable<Lezione[]> {
    return this.http.get<Lezione[]>(`${this.apiUrl}/campo/${encodeURIComponent(nomeCampo)}`);
  }

  create(lezione: Lezione): Observable<Lezione> {
    return this.http.post<Lezione>(this.apiUrl, lezione);
  }

  update(lezione: Lezione): Observable<Lezione> {
    return this.http.put<Lezione>(this.apiUrl, lezione);
  }

  delete(nomeCampo: string, ora: string, data: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(nomeCampo)}/${data}/${ora}`);
  }
}
