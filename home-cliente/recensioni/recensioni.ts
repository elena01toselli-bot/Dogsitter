// src/app/features/home-cliente/recensioni/recensioni.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecensioneService } from '../../../servizi/recensione.service';
import { Recensione } from '../../../modelli/recensioni.model';

// Username del cliente loggato — sostituire con SessionService quando disponibile
const USERNAME_CLIENTE = 'mario.rossi';

/**
 * Componente che mostra la lista delle recensioni scritte dal cliente loggato.
 * Permette di aggiungere, modificare ed eliminare recensioni.
 * I dati vengono caricati tramite RecensioneService all'inizializzazione.
 */
@Component({
  selector: 'app-recensioni',
  imports: [CommonModule],
  templateUrl: './recensioni.html',
  styleUrl: './recensioni.css',
})
export class Recensioni implements OnInit {

  // ── Dipendenze ────────────────────────────────────────────────
  private router = inject(Router);
  protected svc  = inject(RecensioneService); // protected: accessibile dal template

  // ── Signals esposti al template (provengono dal service) ──────
  recensioni  = this.svc.recensioni;   // lista reattiva delle recensioni
  caricamento = this.svc.caricamento;  // true mentre la chiamata HTTP è in corso
  errore      = this.svc.errore;       // messaggio di errore, stringa vuota se assente

  // Array [1,2,3,4,5] usato nel template per renderizzare le stelle
  range5 = [1, 2, 3, 4, 5];

  // ── Lifecycle ─────────────────────────────────────────────────

  ngOnInit(): void {
    // Carica le recensioni del cliente loggato all'avvio del componente
    this.svc.caricaRecensioni(USERNAME_CLIENTE);
  }

  // ── Navigazione ───────────────────────────────────────────────

  /** Naviga al form di aggiunta, resettando l'eventuale recensione in modifica */
  vaiAggiungi(): void {
    this.svc.impostaModifica(null); // assicura che il form si apra in modalità "nuova"
    this.router.navigate(['/home-cliente/add-recensione']);
  }

  /** Naviga al form di modifica precompilando i dati della recensione selezionata */
  vaiModifica(r: Recensione): void {
    this.svc.impostaModifica(r); // salva la recensione nel service per passarla al form
    this.router.navigate(['/home-cliente/add-recensione']);
  }

  // ── Azioni CRUD ───────────────────────────────────────────────

  /** Elimina la recensione identificata dallo username del dogsitter */
  elimina(usernameDogsitter: string): void {
    this.svc.elimina(usernameDogsitter);
  }

  /** Elimina tutte le recensioni del cliente dopo conferma utente */
  cancellaTutto(): void {
    if (this.recensioni().length === 0) return;
    if (confirm('Vuoi davvero eliminare tutte le recensioni?')) {
      this.svc.cancellaTutto(USERNAME_CLIENTE);
    }
  }
}