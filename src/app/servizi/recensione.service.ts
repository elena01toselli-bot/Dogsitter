import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recensione } from '../modelli/recensione.model';

@Injectable({
  providedIn: 'root'
})
export class RecensioneService {

  private apiUrl = 'http://localhost:8080/api/recensioni';

  constructor(private http: HttpClient) {}

  getRecensioniByDogsitter(username: string): Observable<Recensione[]> {
    return this.http.get<Recensione[]>(`${this.apiUrl}/dogsitter/${username}`);
  }

  create(recensione: Recensione): Observable<Recensione> {

    // il seconodo parametro è il body della richiesta
    return this.http.post<Recensione>(this.apiUrl, recensione);
  }

  //otteniamo le recensioni di un cliente specifico
  getRecensioniByCliente(username: string): Observable<Recensione[]> {
    return this.http.get<Recensione[]>(`${this.apiUrl}/cliente/${username}`);
  }

  update(recensione: Recensione): Observable<Recensione> {

    // con <Recensione> indichiamo che ci aspettiamo una recensione aggiornata come risposta,
    //  ma in realtà il backend potrebbe restituire un messaggio di successo o un oggetto diverso.
    //  In tal caso, potremmo dover adattare il tipo di ritorno o gestire la risposta in modo più flessibile.
    return this.http.put<Recensione>(this.apiUrl, recensione);
  }

  delete(recensione :Recensione): Observable<void> {

    //invio sia username cliente sia quello del dogsitter per identificare univocamente la recensione da eliminare
    return this.http.delete<void>(`${this.apiUrl}/${recensione.usernameDogsitter}/${recensione.usernameCliente}`);
  }

  //elimina tutte le recensioni di un cliente
  cancellaTutto(usernameCliente: string | null): Observable<void> {
    if (!usernameCliente) {
      throw new Error('Username cliente non specificato');
    }
    return this.http.delete<void>(`${this.apiUrl}/cliente/${usernameCliente}`);
  }

  //recuperiamo i dogsitter disponibili per popolare la select del form
  getDogsitterDisponibili(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/dogsitter-disponibili`);
  }
}
