import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cane } from '../modelli/cane.model';

@Injectable({
  providedIn: 'root'
})
export class CaneService {

  private apiUrl = 'http://localhost:8080/api/cani';

  constructor(private http: HttpClient) {}

  // Restituisce tutti i cani associati a un cliente
  getByCliente(usernameCliente: string): Observable<Cane[]> {
    return this.http.get<Cane[]>(`${this.apiUrl}/cliente/${usernameCliente}`);
  }

  // Crea un nuovo cane
  create(cane: Cane): Observable<Cane> {
    return this.http.post<Cane>(this.apiUrl, cane);
  }

  // Aggiorna i dati di un cane esistente
  update(cane: Cane): Observable<Cane> {
    return this.http.put<Cane>(`${this.apiUrl}/${cane.nMicrochip}`, cane);
  }

  // Elimina un cane tramite il suo microchip
  delete(nMicrochip: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nMicrochip}`);
  }
}