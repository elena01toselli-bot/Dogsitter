import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lezione } from '../modelli/lezioni.model'; // Regola il percorso se necessario

@Injectable({
  providedIn: 'root'
})
export class LezioneService {

  // Endpoint base per le API delle lezioni nel backend
  private apiUrl = 'http://localhost:8080/api/lezioni';

  constructor(private http: HttpClient) { }

  // Recupera tutte le lezioni associate a uno specifico campo di addestramento
  getByCampo(nomeCampo: string): Observable<Lezione[]> {
    // Inviamo una richiesta GET al backend passandogli il nome del campo come parametro
    return this.http.get<Lezione[]>(`${this.apiUrl}/campo/${nomeCampo}`);
  }

  // Modifica una lezione esistente sul database
  update(lezione: Lezione): Observable<Lezione> {
    // Usiamo il metodo PUT per aggiornare la risorsa sul server, passando l'oggetto nel corpo della richiesta
    return this.http.put<Lezione>(this.apiUrl, lezione);
  }

  // Elimina una lezione specifica dal database
  delete(nomeCampo: string, ora: string, data: string): Observable<void> {
    // Inviamo una richiesta DELETE al backend con i parametri necessari per identificare la lezione da eliminare
    return this.http.delete<void>(`${this.apiUrl}?nomeCampo=${encodeURIComponent(nomeCampo)}&ora=${encodeURIComponent(ora)}&data=${encodeURIComponent(data)}`);
  }

  // Crea una nuova lezione nel database
  create(lezione: Lezione): Observable<Lezione> {
    // Usiamo il metodo POST per creare una nuova risorsa sul server, passando l'oggetto nel corpo della richiesta
    return this.http.post<Lezione>(this.apiUrl, lezione);
  }
}