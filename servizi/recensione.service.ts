// src/app/servizi/recensione.service.ts
//
//  ORA:   dati mock in memoria
//  DOPO:  decommentare i blocchi "CON BE" e rimuovere i blocchi "MOCK"
//         I componenti non vanno toccati.

import { Injectable, signal } from '@angular/core';
// import { inject } from '@angular/core';                         // ← decommentare con BE
// import { HttpClient } from '@angular/common/http';              // ← decommentare con BE
import { Recensione } from '../modelli/recensioni.model';

// const API = 'http://localhost:8080/api';                        // ← decommentare con BE

@Injectable({ providedIn: 'root' })
export class RecensioneService {

  // private http = inject(HttpClient);                            // ← decommentare con BE

  // ── Stato ────────────────────────────────────────────────────
  recensioni           = signal<Recensione[]>([]);
  recensioneInModifica = signal<Recensione | null>(null);
  caricamento          = signal<boolean>(false);
  errore               = signal<string | null>(null);

  // ── Dogsitter disponibili a cui fare recensione ───────────────
  // CON BE:
  //   getDogsitter(): Observable<string[]> {
  //     return this.http.get<string[]>(`${API}/dogsitter/usernames`);
  //   }
  //
  // MOCK:
  dogsitterDisponibili: string[] = [
    'marco.bianchi',
    'laura.verdi',
    'stefano.neri',
  ];

  // ════════════════════════════════════════════════════════════
  //  GET  /api/recensioni?usernameCliente=...
  // ════════════════════════════════════════════════════════════
  caricaRecensioni(usernameCliente: string): void {
    this.caricamento.set(true);
    this.errore.set(null);

    // ── CON BE: ────────────────────────────────────────────────
    // this.http.get<Recensione[]>(`${API}/recensioni?usernameCliente=${usernameCliente}`)
    //   .subscribe({
    //     next:  (data) => { this.recensioni.set(data);           this.caricamento.set(false); },
    //     error: ()     => { this.errore.set('Errore nel caricamento.'); this.caricamento.set(false); }
    //   });

    // ── MOCK (rimuovere con BE) ────────────────────────────────
    setTimeout(() => {
      this.recensioni.set([
        {
          usernameCliente:   usernameCliente,
          usernameDogsitter: 'marco.bianchi',
          voto:              5,
          commento:          'Molto attento e premuroso con il mio cane. Lo consiglio vivamente!',
          data:              '2025-05-12',
        },
        {
          usernameCliente:   usernameCliente,
          usernameDogsitter: 'laura.verdi',
          voto:              3,
          commento:          'Disponibile e gentile, ma a volte poco puntuale.',
          data:              '2025-02-18',
        },
      ]);
      this.caricamento.set(false);
    }, 400);
  }

  // ════════════════════════════════════════════════════════════
  //  POST  /api/recensioni
  // ════════════════════════════════════════════════════════════
  aggiungi(r: Recensione): void {
    this.caricamento.set(true);
    this.errore.set(null);

    // ── CON BE: ────────────────────────────────────────────────
    // this.http.post<Recensione>(`${API}/recensioni`, r).subscribe({
    //   next:  (nuova) => { this.recensioni.update(list => [nuova, ...list]); this.caricamento.set(false); },
    //   error: ()      => { this.errore.set('Errore nel salvataggio.');        this.caricamento.set(false); }
    // });

    // ── MOCK (rimuovere con BE) ────────────────────────────────
    this.recensioni.update((list: Recensione[]) => [r, ...list]);
    this.caricamento.set(false);
  }

  // ════════════════════════════════════════════════════════════
  //  PUT  /api/recensioni/:usernameDogsitter
  //  (chiave composta: usernameCliente + usernameDogsitter)
  // ════════════════════════════════════════════════════════════
  modifica(usernameDogsitter: string, commento: string, voto: number): void {
    this.caricamento.set(true);
    this.errore.set(null);

    // ── CON BE: ────────────────────────────────────────────────
    // const body = { commento, voto };
    // this.http.put<Recensione>(`${API}/recensioni/${usernameDogsitter}`, body).subscribe({
    //   next:  (aggiornata) => {
    //     this.recensioni.update(list =>
    //       list.map(r => r.usernameDogsitter === usernameDogsitter ? aggiornata : r)
    //     );
    //     this.caricamento.set(false);
    //   },
    //   error: () => { this.errore.set('Errore nella modifica.'); this.caricamento.set(false); }
    // });

    // ── MOCK (rimuovere con BE) ────────────────────────────────
    this.recensioni.update((list: Recensione[]) =>
      list.map((r: Recensione) =>
        r.usernameDogsitter === usernameDogsitter ? { ...r, commento, voto } : r
      )
    );
    this.caricamento.set(false);
  }

  // ════════════════════════════════════════════════════════════
  //  DELETE  /api/recensioni/:usernameDogsitter
  // ════════════════════════════════════════════════════════════
  elimina(usernameDogsitter: string): void {
    this.caricamento.set(true);
    this.errore.set(null);

    // ── CON BE: ────────────────────────────────────────────────
    // this.http.delete<void>(`${API}/recensioni/${usernameDogsitter}`).subscribe({
    //   next:  () => {
    //     this.recensioni.update(list => list.filter(r => r.usernameDogsitter !== usernameDogsitter));
    //     this.caricamento.set(false);
    //   },
    //   error: () => { this.errore.set('Errore nella cancellazione.'); this.caricamento.set(false); }
    // });

    // ── MOCK (rimuovere con BE) ────────────────────────────────
    this.recensioni.update((list: Recensione[]) =>
      list.filter((r: Recensione) => r.usernameDogsitter !== usernameDogsitter)
    );
    this.caricamento.set(false);
  }

  // ════════════════════════════════════════════════════════════
  //  DELETE  /api/recensioni?usernameCliente=...
  // ════════════════════════════════════════════════════════════
  cancellaTutto(usernameCliente: string): void {
    this.caricamento.set(true);
    this.errore.set(null);

    // ── CON BE: ────────────────────────────────────────────────
    // this.http.delete<void>(`${API}/recensioni?usernameCliente=${usernameCliente}`).subscribe({
    //   next:  () => { this.recensioni.set([]);                       this.caricamento.set(false); },
    //   error: () => { this.errore.set('Errore nella cancellazione.'); this.caricamento.set(false); }
    // });

    // ── MOCK (rimuovere con BE) ────────────────────────────────
    this.recensioni.set([]);
    this.caricamento.set(false);
  }

  // ── Utility ──────────────────────────────────────────────────
  impostaModifica(r: Recensione | null): void {
    this.recensioneInModifica.set(r);
  }
}