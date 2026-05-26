import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cane } from '../modelli/cane.model';

@Injectable({ providedIn: 'root' })
export class CaneService {

  private apiUrl = 'http://localhost:8080/api/cani';

  constructor(private http: HttpClient) {}

  getByCliente(username: string): Observable<Cane[]> {
    return this.http.get<Cane[]>(`${this.apiUrl}/cliente/${username}`);
  }
}