// src/app/features/home-cliente/profilo-dogsitter/profilo-dogsitter.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DogsitterService } from '../../servizi/dogsitter.service';
import { CaneService } from '../../servizi/cane.service';
import { SessionService } from '../../servizi/session.service';
import { Dogsitter } from '../../modelli/dogsitter.model';
import { Offre, ServizioOfferto } from '../../modelli/servizio.model';
import { Cane } from '../../modelli/cane.model';
import { ServizioService } from '../../servizi/servizio.service';

interface GiornoDisponibile {
  nomeCorto:   string;
  dataCorta:   string;
  data:        Date;
  disponibile: boolean;
}

interface FormPrenotazione {
  orario:         string;
  nMicrochipCane: string;
}


@Component({
  selector: 'app-profilo-dogsitter',
  imports: [CommonModule, FormsModule],
  templateUrl: './info-dogsitter.html',
  styleUrl: './info-dogsitter.css',
})
export class ProfiloDogsitter implements OnInit {

  dogsitter:  Dogsitter | null = null;
  offerte:    ServizioOfferto[]          = [];
  caniCliente: Cane[]          = [];
  errore      = false;
  caricamento = true;

  offertaSelezionata:  ServizioOfferto | null            = null;
  formAperta           = false;
  giorniDisponibili:   GiornoDisponibile[]     = [];
  giornoSelezionato:   GiornoDisponibile | null = null;
  orariDisponibili     = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];
  prenotazione: FormPrenotazione = { orario: '', nMicrochipCane: '' };
  toastVisibile = false;

  constructor(
    private route:        ActivatedRoute,
    private router:       Router,
    private dogsitterSrv: DogsitterService,
    private caneSrv:      CaneService,
    private session:      SessionService,
    private servizioSrv:  ServizioService,
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username') ?? '';
    if (!username) { this.errore = true; this.caricamento = false; return; }

    this.dogsitterSrv.getByUser(username).subscribe({
      next: (res: Dogsitter) => {
        this.dogsitter   = res;
        this.caricamento = false;
        this.generaGiorni(res.giorniDisponibili);
        this.caricaServizi(username);
      },
      error: () => { this.errore = true; this.caricamento = false; },
    });

    const utente = this.session.getLoggedUser();
    if (utente?.username) {
      this.caneSrv.getByCliente(utente.username).subscribe({
        next:  (res: Cane[]) => { this.caniCliente = res ?? []; },
        error: ()            => { this.caniCliente = []; },
      });
    }
  }

  caricaServizi(username: string): void {
    this.servizioSrv.getServiziBySitter(username).subscribe({
      next: (res: ServizioOfferto[]) => { this.offerte = res ?? []; },
      error: () => { this.offerte = []; },
    });
  }

  generaGiorni(giorniBackend: string[] = []): void {
    const nomi  = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
    const brevi = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    const mesi  = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    const oggi  = new Date(); oggi.setHours(0,0,0,0);
    const dispSet = new Set(giorniBackend.map(g => g.toLowerCase()));

    this.giorniDisponibili = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(oggi);
      d.setDate(oggi.getDate() + i);
      const disponibile = dispSet.size > 0
        ? dispSet.has(nomi[d.getDay()])
        : d.getDay() !== 0;
      this.giorniDisponibili.push({
        nomeCorto:  brevi[d.getDay()],
        dataCorta:  `${d.getDate()} ${mesi[d.getMonth()]}`,
        data:       d,
        disponibile,
      });
    }
  }

  /** Formatta i minuti in stringa leggibile: es. 90 → "1h 30min", 60 → "1h" */
  formatDurata(minuti: number): string {
    if (!minuti) return '';
    const h   = Math.floor(minuti / 60);
    const min = minuti % 60;
    if (h && min) return `${h}h ${min}min`;
    if (h)        return `${h}h`;
    return `${min}min`;
  }

  apriForm(offerta: ServizioOfferto): void {
    this.offertaSelezionata = offerta;
    this.formAperta         = true;
    this.giornoSelezionato  = null;
    this.prenotazione       = { orario: '', nMicrochipCane: '' };
  }

  chiudiForm(): void {
    this.formAperta         = false;
    this.offertaSelezionata = null;
  }

  selezionaGiorno(g: GiornoDisponibile): void {
    if (!g.disponibile) return;
    this.giornoSelezionato   = g;
    this.prenotazione.orario = '';
  }

  get formValida(): boolean {
    return !!this.giornoSelezionato &&
           !!this.prenotazione.orario &&
           !!this.prenotazione.nMicrochipCane;
  }

  confermaPrenotazione(): void {
    if (!this.formValida) return;
    const payload = {
      tipo:              'servizio',
      usernameDogsitter: this.dogsitter?.username,
      categoriaServizio: this.offertaSelezionata?.categoria,
      prezzoListino:     this.offertaSelezionata?.prezzoListino,
      durataMinuti:      this.offertaSelezionata?.durata,   // ← nuovo campo
      // con toISOString() otteniamo una stringa in formato ISO 8601, es. "2024-07-01T00:00:00.000Z".
      //  Con split('T')[0] prendiamo solo la parte della data "2024-07-01"
      giorno:            this.giornoSelezionato!.data.toISOString().split('T')[0],
      orario:            this.prenotazione.orario,
      nMicrochipCane:    this.prenotazione.nMicrochipCane,
    };
    // TODO: this.prenotazioneSrv.crea(payload).subscribe(...)
    console.log('Prenotazione dogsitter:', payload);
    this.chiudiForm();
    this.mostraToast();
  }

  mostraToast(): void {
    this.toastVisibile = true;
    setTimeout(() => { this.toastVisibile = false; }, 3500);
  }

  torna(): void {
    this.router.navigate(['/home-cliente']);
  }
}