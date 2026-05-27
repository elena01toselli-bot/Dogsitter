import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelli/cliente.model';

// @Injectable dice ad Angular che questa classe può essere iniettata
// nei componenti come dipendenza
// providedIn: 'root' significa che Angular crea UNA SOLA istanza
// condivisa da tutta l'app (Singleton)
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // URL base del tuo backend — quando il backend è pronto
  // sostituisci localhost con l'indirizzo reale
  private apiUrl = 'http://localhost:8080/api/clienti';

  // HttpClient è il servizio Angular per le chiamate HTTP
  // lo inietti esattamente come fai con Router o ActivatedRoute
  // http lo posso usare perchè l'ho importato in app.config.ts con provideHttpClient() e poi iniettato qui
  constructor(private http: HttpClient) {}

  // Restituisce un Observable — il componente si iscrive
  // e riceve i dati quando il backend risponde
  getAll(): Observable<Cliente[]> {

    // usando i generics <Cliente[]> dico a TypeScript che appena arriva la risposta JSON dal server, 
    // deve essere mappata e considerata come un array di oggetti Cliente.
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(username: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${username}`);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/${cliente.username}`,
      cliente  // questo viene mandato come corpo della richiesta HTTP
    );
  }

  delete(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${username}`);
  }


}