// src/app/features/home-cliente/recensioni/recensioni.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Recensione } from '../../../modelli/recensione.model';
import { RecensioneService } from '../../../servizi/recensione.service';
import { SessionService } from '../../../servizi/session.service';


@Component({
  selector: 'app-recensioni',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recensioni.html',
  styleUrl: './recensioni.css'
})
export class Recensioni implements OnInit, OnDestroy {

  recensioni: Recensione[] = [];
  caricamento: boolean = true;
  errore: string | null = null;
  private recensioniSubscription: Subscription | undefined;

  constructor(
    private recensioneSrv: RecensioneService,
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecensioni();
  }

  ngOnDestroy(): void {
    this.recensioniSubscription?.unsubscribe();
  }

  loadRecensioni(): void {
    this.caricamento = true;
    this.errore = null;
    const utente = this.session.getLoggedUser();

    if (utente?.username) {
      this.recensioniSubscription = this.recensioneSrv.getRecensioniByCliente(utente.username).subscribe({
        next: (data) => {
          this.recensioni = data;
          this.caricamento = false;
        },
        error: (err) => {
          this.errore = 'Impossibile caricare le recensioni. Riprova più tardi.';
          console.error(err);
          this.caricamento = false;
        }
      });
    } else {
      this.errore = 'Utente non loggato.';
      this.caricamento = false;
    }
  }

  // funzione di aggiunta recensione, che porta alla pagina di creazione recensione
  aggiungiRecensione(): void {
    this.router.navigate(['/home-cliente/recensioni/add']);
  }

  modificaRecensione(recensione: Recensione): void {
    this.router.navigate(['/home-cliente/recensioni/edit'], { state: { recensioneDaModificare: recensione} });
  }

  eliminaRecensione(recensione: Recensione): void {
    if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
      this.recensioneSrv.delete(recensione).subscribe({
        next: () => {
          this.loadRecensioni(); // Ricarica la lista dopo l'eliminazione
        },
        error: (err) => {
          this.errore = 'Impossibile eliminare la recensione.';
          console.error(err);
        }
      });
    }
  }
}