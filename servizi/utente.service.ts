import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Utente } from '../modelli/utente.model';

export interface AuthResponse {
  token: string;
  user: Partial<Utente>;
}

@Injectable({ providedIn: 'root' })
export class UtenteService {

  private apiUrl  = 'http://localhost:8080/api/utenti';
  private authUrl = 'http://localhost:8080/api/auth';

  // ─── MOCK FLAG ────────────────────────────────────────────────────────────
  // Quando il backend non è disponibile, imposta questa variabile a true.
  // Quando il backend è pronto, rimetti a false: il resto del codice non cambia.
  private usaMock = true;
  // ─────────────────────────────────────────────────────────────────────────

  // Database finto in memoria: contiene gli utenti creati durante la sessione.
  // Partiamo con tre utenti di esempio, uno per ruolo, per testare il login.
  private mockUtenti: Utente[] = [
    { username: 'cliente1',  password: '1234', ruolo: 'cliente',        nomeBattesimo: 'Mario',  cognome: 'Rossi',  nTel: '', via: '', nCivico: '', cap: '', provincia: '' },
    { username: 'sitter1',   password: '1234', ruolo: 'dogsitter',      nomeBattesimo: 'Laura',  cognome: 'Bianchi',nTel: '', via: '', nCivico: '', cap: '', provincia: '' },
    { username: 'admin1',    password: '1234', ruolo: 'amministratore', nomeBattesimo: 'Admin',  cognome: 'Admin',  nTel: '', via: '', nCivico: '', cap: '', provincia: '' },
  ];

  constructor(private http: HttpClient) {}

  // ── CREATE ────────────────────────────────────────────────────────────────

  create(utente: any): Observable<Utente> {
    if (this.usaMock) {
      // Verifica che lo username non esista già
      if (this.mockUtenti.find(u => u.username === utente.username)) {
        return throwError(() => ({ status: 409, message: 'Username già esistente' }));
      }
      this.mockUtenti.push(utente);
      // of(...) crea un Observable che emette subito il valore e completa
      return of(utente);
    }
    return this.http.post<Utente>(this.apiUrl, utente);
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  login(username: string, password: string): Observable<AuthResponse> {
    if (this.usaMock) {
      const utente = this.mockUtenti.find(
        u => u.username === username && u.password === password
      );
      if (utente) {
        // Simuliamo una risposta identica a quella del backend reale
        return of({
          token: 'mock-token-' + username,
          user: { username: utente.username, ruolo: utente.ruolo }
        });
      }
      // throwError simula un 401 Unauthorized
      return throwError(() => ({ status: 401, message: 'Credenziali errate' }));
    }
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, { username, password });
  }

  // ── GET ALL ───────────────────────────────────────────────────────────────

  getAll(): Observable<Utente[]> {
    if (this.usaMock) return of([...this.mockUtenti]);
    return this.http.get<Utente[]>(this.apiUrl);
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────

  getById(username: string): Observable<Utente> {
    if (this.usaMock) {
      const utente = this.mockUtenti.find(u => u.username === username);
      if (utente) return of(utente);
      return throwError(() => ({ status: 404, message: 'Utente non trovato' }));
    }
    return this.http.get<Utente>(`${this.apiUrl}/${encodeURIComponent(username)}`);
  }

  // ── GET BY USERNAME (usato dal fallback login) ────────────────────────────

  getUserByUsername(username: string): Observable<Utente[]> {
    if (this.usaMock) {
      return of(this.mockUtenti.filter(u => u.username === username));
    }
    return this.http.get<Utente[]>(`${this.apiUrl}?username=${encodeURIComponent(username)}`);
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────

  update(utente: Utente): Observable<Utente> {
    if (this.usaMock) {
      const idx = this.mockUtenti.findIndex(u => u.username === utente.username);
      if (idx > -1) this.mockUtenti[idx] = utente;
      return of(utente);
    }
    return this.http.put<Utente>(`${this.apiUrl}/${encodeURIComponent(utente.username)}`, utente);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  delete(username: string): Observable<void> {
    if (this.usaMock) {
      this.mockUtenti = this.mockUtenti.filter(u => u.username !== username);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(username)}`);
  }
}