// src/app/features/home-cliente/recensioni/add-recensione/add-recensione.ts
import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecensioneService } from '../../../../servizi/recensione.service';
import { Recensione } from '../../../../modelli/recensioni.model';

// Username del cliente loggato — sostituire con SessionService quando disponibile
const USERNAME_CLIENTE = 'mario.rossi';

/**
 * Form per aggiungere o modificare una recensione.
 * Funziona in due modalità:
 *  - "nuova":    usernameDogsitter selezionabile, campi vuoti
 *  - "modifica": usernameDogsitter bloccato (readonly), campi precompilati
 * La modalità è determinata dalla presenza di una recensione in RecensioneService.
 */
@Component({
  selector: 'app-add-recensione',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-recensione.html',
  styleUrl: './add-recensione.css',
})
export class AddRecensione implements OnInit {

  // ── Dipendenze ────────────────────────────────────────────────
  private router = inject(Router);
  protected svc  = inject(RecensioneService); // protected: accessibile dal template

  // ── Campi del form (signals reattivi) ─────────────────────────
  usernameDogsitter = signal<string>('');  // destinatario della recensione
  commento          = signal<string>('');  // testo libero dell'utente
  voto              = signal<number>(0);   // punteggio da 1 a 5 (0 = non ancora scelto)

  // Array [1,2,3,4,5] usato nel template per renderizzare i bottoni stelle
  range5 = [1, 2, 3, 4, 5];

  // ── Computed: modalità e stato form ──────────────────────────

  /** true se stiamo modificando una recensione esistente, false se è nuova */
  isModifica = computed(() => this.svc.recensioneInModifica() !== null);

  /** Titolo dinamico della pagina in base alla modalità */
  titoloPagina = computed(() =>
    this.isModifica() ? 'Modifica recensione' : 'Nuova recensione'
  );

  /** Il form è valido solo se tutti e tre i campi sono compilati */
  formValido = computed(() =>
    this.usernameDogsitter().trim().length > 0 &&
    this.commento().trim().length > 0 &&
    this.voto() > 0
  );

  // ── Lifecycle ─────────────────────────────────────────────────

  ngOnInit(): void {
    // Se siamo in modalità modifica, precompila i campi con i dati esistenti
    const r: Recensione | null = this.svc.recensioneInModifica();
    if (r) {
      this.usernameDogsitter.set(r.usernameDogsitter);
      this.commento.set(r.commento);
      this.voto.set(r.voto);
    }
  }

  // ── Gestori eventi ────────────────────────────────────────────

  /** Aggiorna il signal usernameDogsitter quando l'utente cambia la select */
  onDogsitterChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.usernameDogsitter.set(val);
  }

  /** Imposta il voto cliccato dall'utente sulla stella corrispondente */
  setVoto(v: number): void { this.voto.set(v); }

  // ── Azioni form ───────────────────────────────────────────────

  /**
   * Salva la recensione (nuova o modificata) e torna alla lista.
   * Chiamato solo se formValido() è true (il bottone è disabled altrimenti).
   */
  conferma(): void {
    if (!this.formValido()) return;

    const r: Recensione | null = this.svc.recensioneInModifica();

    if (this.isModifica() && r) {
      // Aggiorna commento e voto della recensione esistente
      this.svc.modifica(r.usernameDogsitter, this.commento(), this.voto());
    } else {
      // Crea una nuova recensione con la data odierna
      const nuova: Recensione = {
        usernameCliente:   USERNAME_CLIENTE,
        usernameDogsitter: this.usernameDogsitter(),
        voto:              this.voto(),
        commento:          this.commento(),
        data:              new Date().toISOString().split('T')[0], // formato YYYY-MM-DD
      };
      this.svc.aggiungi(nuova);
    }

    // Pulisce la recensione in modifica e torna alla lista
    this.svc.impostaModifica(null);
    this.router.navigate(['/home-cliente/recensioni']);
  }

  /** Annulla senza salvare e torna alla lista recensioni */
  annulla(): void {
    this.svc.impostaModifica(null);
    this.router.navigate(['/home-cliente/recensioni']);
  }
}