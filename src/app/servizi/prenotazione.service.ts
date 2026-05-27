import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prenotazione } from '../modelli/prenotazione.model';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  private apiUrl = 'http://localhost:8080/api/prenotazioni';

  constructor(private http: HttpClient) {}

  getAllByCliente(username: string): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/cliente/${username}`);
  }

  getAllByDogsitter(username: string): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/dogsitter/${username}`);
  }

  getById(id: number): Observable<Prenotazione> {
    return this.http.get<Prenotazione>(`${this.apiUrl}/${id}`);
  }

  update(id: number, prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.apiUrl}/${id}`, prenotazione);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  create(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(this.apiUrl, prenotazione);
  }
}
