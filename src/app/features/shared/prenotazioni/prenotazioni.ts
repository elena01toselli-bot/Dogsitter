import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prenotazione } from '../../../modelli/prenotazione.model';
import { PrenotazioneService } from '../../../servizi/prenotazione.service';
import { ServizioService } from '../../../servizi/servizio.service';

@Component({
  selector: 'app-prenotazioni',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prenotazioni.html',
  styleUrls: ['./prenotazioni.css'],
})
export class Prenotazioni implements OnInit {
  ruolo: 'dogsitter' | 'cliente' = 'cliente';
  usernameCorrente: string = '';
  tutteLePrenotazioni: Prenotazione[] = [];
  prenotazioniFiltrate: Prenotazione[] = [];

  // Filtri Cliente
  filtroTipoServizio: 'campo' | 'dogsitter' | '' = '';
  filtroNomeCane: string = '';
  filtroDataCliente: string = '';
  filtroOraCliente: string = '';

  // Filtri Dog Sitter
  filtroNomeCaneDogsitter: string = '';
  filtroCategoriaDogsitter: string = '';
  categorieDisponibili: string[] = [];
  filtroDataDogsitter: string = '';
  filtroOraDogsitter: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prenotazioneService: PrenotazioneService,
    private servizioService: ServizioService
  ) {}

  ngOnInit(): void {
    this.usernameCorrente = this.route.snapshot.params['username'];
    this.ruolo = this.route.snapshot.data['ruolo'];
    
    this.caricaPrenotazioni();

    if (this.ruolo === 'dogsitter') {
      this.servizioService.getCategorieDisponibili().subscribe(categorie => {
        this.categorieDisponibili = categorie;
      });
    }
  }

  caricaPrenotazioni(): void {
    const service = this.ruolo === 'cliente' 
      ? this.prenotazioneService.getAllByCliente(this.usernameCorrente)
      : this.prenotazioneService.getAllByDogsitter(this.usernameCorrente);

    service.subscribe({
      next: (dati) => {
        this.tutteLePrenotazioni = dati;
        this.prenotazioniFiltrate = [...this.tutteLePrenotazioni];
      },
      error: (err) => console.error("Errore caricamento prenotazioni", err)
    });
  }

  applicaFiltri(): void {
    if (this.ruolo === 'cliente') {
      this.prenotazioniFiltrate = this.tutteLePrenotazioni.filter(p => {

        // il !this.filtroTipoServizio serve a dire "se il filtro è vuoto,
        //  allora test superato".
        const matchTipo = !this.filtroTipoServizio || 
                          (this.filtroTipoServizio === 'campo' && p.categoriaServizio === 'lezione') ||
                          (this.filtroTipoServizio === 'dogsitter' && p.categoriaServizio === 'dogsitter');
        const matchCane = !this.filtroNomeCane || p.nomeCane.toLowerCase().includes(this.filtroNomeCane.toLowerCase());
        const matchData = !this.filtroDataCliente || p.dataSvolgimento === this.filtroDataCliente;
        const matchOra = !this.filtroOraCliente || p.oraSvolgimento.startsWith(this.filtroOraCliente);
        return matchTipo && matchCane && matchData && matchOra;
      });
    } else { // Dogsitter
      this.prenotazioniFiltrate = this.tutteLePrenotazioni.filter(p => {
        const matchCane = !this.filtroNomeCaneDogsitter || p.nomeCane.toLowerCase().includes(this.filtroNomeCaneDogsitter.toLowerCase());
        const matchCategoria = !this.filtroCategoriaDogsitter || p.categoriaServizio === this.filtroCategoriaDogsitter;
        const matchData = !this.filtroDataDogsitter || p.dataSvolgimento === this.filtroDataDogsitter;
        const matchOra = !this.filtroOraDogsitter || p.oraSvolgimento.startsWith(this.filtroOraDogsitter);
        return matchCane && matchCategoria && matchData && matchOra;
      });
    }
  }

  resetFiltri(): void {
    // Reset filtri cliente
    this.filtroTipoServizio = '';
    this.filtroNomeCane = '';
    this.filtroDataCliente = '';
    this.filtroOraCliente = '';
    // Reset filtri dogsitter
    this.filtroNomeCaneDogsitter = '';
    this.filtroCategoriaDogsitter = '';
    this.filtroDataDogsitter = '';
    this.filtroOraDogsitter = '';
    
    this.prenotazioniFiltrate = [...this.tutteLePrenotazioni];
  }

  modifica(prenotazione: Prenotazione): void {
    this.router.navigate(['/modifica-prenotazione'], {
      state: {
        prenotazione: prenotazione,
        ruolo: this.ruolo
      }
    });
  }

  elimina(prenotazione: Prenotazione): void {
    if (confirm(`Sei sicuro di voler eliminare la prenotazione #${prenotazione.codiceId}?`)) {
      this.prenotazioneService.delete(prenotazione.codiceId).subscribe({
        next: () => {
          this.tutteLePrenotazioni = this.tutteLePrenotazioni.filter(p => p.codiceId !== prenotazione.codiceId);
          this.applicaFiltri();
        },
        error: (err) => alert('Errore durante l\'eliminazione della prenotazione.')
      });
    }
  }

  formattaData(data: string): string {
    if (!data) return '';

    // prendo la stringa in formato "YYYY-MM-DD", la divido in 3 parti usando il trattino 
    // come separatore, e poi riassemblo la data in formato "DD/MM/YYYY"
    const [anno, mese, giorno] = data.split('-');
    return `${giorno}/${mese}/${anno}`;
  }
}