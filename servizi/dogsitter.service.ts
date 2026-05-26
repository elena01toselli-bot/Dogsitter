// src/app/servizi/dogsitter.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dogsitter } from '../modelli/dogsitter.model';
import { Offre } from '../modelli/servizio.model';


@Injectable({ providedIn: 'root' })
export class DogsitterService {

  private apiUrl = 'http://localhost:8080/api/dogsitter';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Dogsitter[]> {
    return this.http.get<Dogsitter[]>(this.apiUrl);
  }

  getById(username: string): Observable<Dogsitter> {
    return this.http.get<Dogsitter>(`${this.apiUrl}/${username}`);
  }

  // alias usato da profilo-dogsitter.ts
  getByUsername(username: string): Observable<Dogsitter> {
    return this.getById(username);
  }

  getServizi(username: string): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/${username}/servizi`);
  }

  create(dogsitter: Dogsitter): Observable<Dogsitter> {
    return this.http.post<Dogsitter>(this.apiUrl, dogsitter);
  }

  update(dogsitter: Dogsitter): Observable<Dogsitter> {
    return this.http.put<Dogsitter>(`${this.apiUrl}/${dogsitter.username}`, dogsitter);
  }

  delete(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${username}`);
  }
}