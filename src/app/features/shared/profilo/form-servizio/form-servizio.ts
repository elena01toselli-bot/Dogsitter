import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ServizioService } from '../../../../servizi/servizio.service'; // Path corretto
import { ServizioOfferto } from '../../../../modelli/servizio.model'; // Importa dal tuo file dei modelli
import { PrenotazioneService } from '../../../../servizi/prenotazione.service';
import { Prenotazione } from '../../../../modelli/prenotazione.model';

@Component({
  selector: 'app-form-servizio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-servizio.html',
  styleUrl: './form-servizio.css'
})
export class FormServizio implements OnInit {
  
  // STATO PER SERVIZI OFFERTI
  tipologieGlobaliDB: string[] = []; 
  isModifica: boolean = false;
  idServizioEsistente?: number; // Diventa il riferimento per idServizio
  usernameDogsitter: string = '';
  categoriaSelezionata: string = '';
  durata: number = 0;
  prezzoListino: number = 0;

  // STATO PER PRENOTAZIONI
  isModificaPrenotazione: boolean = false;
  prenotazioneEsistente?: Prenotazione;
  dataSvolgimento: string = '';
  oraSvolgimento: string = '';
  prezzoPattuito: number = 0;

  constructor(
    private router: Router, 
    private servizioService: ServizioService,
    private prenotazioneService: PrenotazioneService
  ) {
    // Recuperiamo lo stato nativo del browser (sostituisce getCurrentNavigation)
    const state = history.state;

    if (state) {
      if (state.isModificaPrenotazione) {
        // --- MODALITÀ MODIFICA PRENOTAZIONE ---
        this.isModificaPrenotazione = true;
        this.prenotazioneEsistente = state.prenotazioneDaModificare;
        if (this.prenotazioneEsistente) {
          this.dataSvolgimento = this.prenotazioneEsistente.dataSvolgimento;
          this.oraSvolgimento = this.prenotazioneEsistente.oraSvolgimento;
          this.prezzoPattuito = this.prenotazioneEsistente.prezzoPattuito;
        }
      } else if (state.sitterUsername) {
        // --- MODALITÀ GESTIONE SERVIZIO OFFERTO ---
        this.usernameDogsitter = state.sitterUsername; // Verifichiamo che lo stato esista e contenga il nostro username
        
        const daModificare: ServizioOfferto = state.servizioDaModificare;
        if (daModificare) {
          this.isModifica = true;
          this.idServizioEsistente = daModificare.idServizio;
          this.categoriaSelezionata = daModificare.categoria;
          this.durata = daModificare.durata;
          this.prezzoListino = daModificare.prezzoListino || 0; // Carica anche il prezzo!
        }
      }
    }
  }

  ngOnInit(): void {
    if (!this.isModificaPrenotazione) {
      this.servizioService.getCategorieDisponibili().subscribe({
        next: (categorie) => this.tipologieGlobaliDB = categorie,
        error: (err) => console.error('Errore nel caricamento delle categorie dal DB', err)
      });
    }
  }

  salva(): void {
    if (this.isModificaPrenotazione) {
      this.salvaPrenotazione();
    } else {
      this.salvaServizioOfferto();
    }
  }

  private salvaPrenotazione(): void {
    if (!this.dataSvolgimento || !this.oraSvolgimento || this.prezzoPattuito <= 0 || !this.prenotazioneEsistente) {
      alert('Compila tutti i campi della prenotazione in modo valido!');
      return;
    }

    const payload: Prenotazione = {
      ...this.prenotazioneEsistente,
      dataSvolgimento: this.dataSvolgimento,
      oraSvolgimento: this.oraSvolgimento,
      prezzoPattuito: this.prezzoPattuito
    };

    this.prenotazioneService.update(payload.codiceId, payload).subscribe({
      next: () => {
        alert('Prenotazione aggiornata con successo!');
        this.router.navigate(['/home-dogsitter/prenotazioni']);
      },
      error: () => alert('Errore durante la modifica della prenotazione')
    });
  }

  private salvaServizioOfferto(): void {
    if (!this.categoriaSelezionata || !this.durata || this.durata <= 0 || this.prezzoListino <= 0) {
      alert('Compila tutti i campi con valori validi!');
      return;
    }

    // Costruiamo l'oggetto DTO rispettando il modello condiviso
    const payload: ServizioOfferto = {
      idServizio: this.idServizioEsistente,
      usernameDogsitter: this.usernameDogsitter,
      categoria: this.categoriaSelezionata,
      durata: this.durata,
      prezzoListino: this.prezzoListino
    };

    if (this.isModifica && this.idServizioEsistente) {
      // Eseguiamo la PUT usando l'idServizio corretto
      this.servizioService.modificaServizio(this.idServizioEsistente, payload).subscribe({
        next: () => {
          this.router.navigate(['/home-dogsitter/profilo']);
        },
        error: () => alert('Errore durante la modifica del servizio')
      });
    } else {
      // Eseguiamo la POST per un nuovo inserimento
      this.servizioService.aggiungiServizio(payload).subscribe({
        next: () => {
          this.router.navigate(['/home-dogsitter/profilo']);
        },
        error: () => alert('Errore durante il salvataggio del servizio')
      });
    }
  }

  annulla(): void {
    if (this.isModificaPrenotazione) {
      this.router.navigate(['/home-dogsitter/prenotazioni']);
    } else {
      this.router.navigate(['/home-dogsitter/profilo']);
    }
  }
}