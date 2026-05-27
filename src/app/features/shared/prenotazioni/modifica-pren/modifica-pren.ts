import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prenotazione } from '../../../../modelli/prenotazione.model';
import { PrenotazioneService } from '../../../../servizi/prenotazione.service';
import { CaneService } from '../../../../servizi/cane.service';
import { Cane } from '../../../../modelli/cane.model';

@Component({
  selector: 'app-modifica-pren',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modifica-pren.html',
  styleUrls: ['./modifica-pren.css']
})
export class ModificaPren implements OnInit {
  
  
  prenotazione: Prenotazione | null = null;
  ruolo: 'cliente' | 'dogsitter' = 'cliente';
  caniDelCliente: Cane[] = [];
  usernameCorrente: string = ''; // Assumendo che venga passato o recuperato

  constructor(
    private router: Router,
    private prenotazioneService: PrenotazioneService,
    private caneService: CaneService
  ) {
      const state = history.state;
      if (state.prenotazione && state.ruolo) {
        this.prenotazione = state.prenotazione;
        this.ruolo = state.ruolo;
    }
  }
  ngOnInit(): void {
   
    // Controlla se this.prenotazione è null o undefined.
    // Se lo è, l'intera espressione si ferma e restituisce immediatamente undefined
    if (this.ruolo === 'cliente' && this.prenotazione?.usernameCliente) {
      this.usernameCorrente = this.prenotazione.usernameCliente;
      this.caneService.getByCliente(this.usernameCorrente).subscribe({
        next: (cani) => this.caniDelCliente = cani,
        error: (err) => console.error("Errore caricamento cani del cliente", err)
      });
    }
  }

  onCaneChange(nomeCane: string): void {
    const caneSelezionato = this.caniDelCliente.find(c => c.nome === nomeCane);
    if (this.prenotazione && caneSelezionato) {
      this.prenotazione.nMicrochip = caneSelezionato.nMicrochip;
    }
  }

  get isLezioneCampo(): boolean {
    return this.prenotazione?.categoriaServizio === 'lezione';
  }

  salva(): void {
    if (!this.prenotazione) return;

    this.prenotazioneService.update(this.prenotazione.codiceId, this.prenotazione).subscribe({
      next: () => {
        alert('Prenotazione modificata con successo!');
        this.tornaIndietro();
      },
      error: () => alert('Errore durante il salvataggio delle modifiche.')
    });
  }

  tornaIndietro(): void {
    const rotta = this.ruolo === 'cliente' ? `/home-cliente/${this.usernameCorrente}/prenotazioni` : `/home-dogsitter/${this.usernameCorrente}/prenotazioni`;
    this.router.navigate([rotta]);
  }
}
