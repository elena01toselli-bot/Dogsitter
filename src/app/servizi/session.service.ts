import { Injectable } from '@angular/core';
import { Utente } from '../modelli/utente.model';

/*
  SessionService
  - Responsabilità: conservare e fornire informazioni di sessione lato client.
  - Implementazione: salva un token di autenticazione e un oggetto "mini-utente"
    (solo i campi non sensibili) in localStorage. Espone helper per usare
    facilmente lo stato di autenticazione dall'app.

  Nota di sicurezza: in produzione non salvare password in chiaro nel localStorage.
  Meglio salvare esclusivamente un token (es. JWT) e, se necessario, un oggetto
  minimale con `username` e `ruolo`.
*/

@Injectable({ providedIn: 'root' })
export class SessionService {
  // Chiavi usate nello storage per token e mini-utente
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'loggedUtente';

  // Salva il token di autenticazione (es. JWT) nello storage
  setToken(token: string): void {
    // localStorage mantiene i dati tra ricariche del browser
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Recupera il token di autenticazione dallo storage, o null se assente
  getToken(): string | null {
    
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Rimuove il token dallo storage (es. durante il logout)
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Salva un oggetto Utente minimale nello storage. Attenzione: non salvare
  // password o dati sensibili. Passare solo i campi necessari (username, ruolo).
  setLoggedUser(utente: Partial<Utente>): void {
    try {
      const safe = JSON.stringify(utente);
      localStorage.setItem(this.USER_KEY, safe);
    } catch (e) {
      // In casi estremi di storage pieno o serializzazione fallita, gestire qui
      console.error('Impossibile salvare utente in sessione', e);
    }
  }

  // Recupera il mini-utente dallo storage o null se non presente
  getLoggedUser(): Partial<Utente> | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Partial<Utente>;
    } catch (e) {
      console.error('Dati utente corrotti nello storage', e);
      return null;
    }
  }

  // Rimuove l'oggetto utente dallo storage (logout)
  clearLoggedUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Helper: ritorna true se esiste un token valido nello storage
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Helper: ritorna il ruolo dell'utente loggato, se presente
  getRuolo(): string | null {
    const ut = this.getLoggedUser();
    return ut && ut.ruolo ? ut.ruolo : null;
  }

  // Helper: ritorna lo username dell'utente loggato, se presente
  getUsername(): string | null {
    const ut = this.getLoggedUser();
    return ut && ut.username ? ut.username : null;
  }

  // Pulizia completa della sessione (token + utente)
  clearSession(): void {
    this.clearToken();
    this.clearLoggedUser();
  }
}