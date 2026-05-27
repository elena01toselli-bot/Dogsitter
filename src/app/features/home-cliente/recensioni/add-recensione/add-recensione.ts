// src/app/features/home-cliente/recensioni/add-recensione/add-recensione.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecensioneService } from '../../../../servizi/recensione.service';
import { Recensione } from '../../../../modelli/recensione.model';
import { SessionService } from '../../../../servizi/session.service';

@Component({
  selector: 'app-add-recensione',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-recensione.html',
  styleUrls: ['./add-recensione.css'],
})
export class AddRecensione implements OnInit {

  // Proprietà per gestire lo stato e i dati del form
  isModifica: boolean = false;
  titoloPagina: string = 'Nuova recensione';
  
  // Dati del form
  usernameDogsitter: string = '';
  voto: number = 0;
  commento: string = '';

  // Array per le stelle
  range5 = [1, 2, 3, 4, 5];

  // Service iniettati
  dogsitterDisponibili: string[] = [];

  constructor(
    private router: Router,
    public svc: RecensioneService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // Carico i dogsitter disponibili per la select
    this.svc.getDogsitterDisponibili().subscribe(dogsitter => {
      this.dogsitterDisponibili = dogsitter;
    });

    //qui noi controlliamo se siamo in modalità modifica o creazione, basandoci sullo stato passato dal router
    // Se c'è una recensione da modificare, precompiliamo il form e cambiamo il titolo della pagina
    // se non c'è history.state.recensioneDaModificare, allora siamo in modalità creazione e lasciamo il form vuoto con il titolo "Nuova recensione"
    const stato = history.state as { recensioneDaModificare?: Recensione };

    if (stato && stato.recensioneDaModificare) {
      // Modalità MODIFICA
      const rec = stato.recensioneDaModificare;
      this.isModifica = true;
      this.titoloPagina = 'Modifica recensione';
      this.usernameDogsitter = rec.usernameDogsitter;
      this.voto = rec.voto;
      this.commento = rec.commento;
    } else {
      // Modalità NUOVA
      this.isModifica = false;
      this.titoloPagina = 'Nuova recensione';
    }
  }

  /** Controlla se il form è valido per abilitare il tasto di conferma */
  formValido(): boolean {
    return this.usernameDogsitter !== '' && this.voto > 0 && this.commento.trim() !== '';
  }

  /** Gestore per il cambio della select del dogsitter */
  onDogsitterChange(event: Event): void {
    this.usernameDogsitter = (event.target as HTMLSelectElement).value;
  }

  /** Imposta il voto cliccato */
  setVoto(v: number): void {
    this.voto = v;
  }

  /** Salva o aggiorna la recensione */
  conferma(): void {
    if (!this.formValido()) return;

    const usernameCliente = this.sessionService.getUsername();
    if (!usernameCliente) {
      console.error("Utente non loggato, impossibile salvare la recensione.");
      return;
    }

    const rec: Recensione = {
      usernameCliente: usernameCliente,
      usernameDogsitter: this.usernameDogsitter,
      voto: this.voto,
      commento: this.commento,
      data: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    };

    const action = this.isModifica 
      ? this.svc.update(rec) 
      : this.svc.create(rec);

    action.subscribe({
      next: () => {
        this.router.navigate(['/home-cliente/recensioni']);
      },
      error: (err) => {
        console.error('Errore durante il salvataggio della recensione:', err);
        // Qui potresti mostrare un messaggio di errore all'utente
      }
    });
  }

  /** Annulla l'operazione e torna indietro */
  annulla(): void {
    this.router.navigate(['/home-cliente/recensioni']);
  }
}