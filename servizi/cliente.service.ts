import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelli/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/api/clienti';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(username: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${username}`);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/${cliente.username}`,
      cliente
    );
  }

  delete(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${username}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }
}
