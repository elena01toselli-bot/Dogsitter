// ════════════════════════════════════════════════════════════════════
//  INFO-DOGSITTER  –  pagina di dettaglio di un dogsitter
//  Mostra il profilo del dogsitter, i servizi che offre e il form
//  per prenotare uno specifico servizio.
// ════════════════════════════════════════════════════════════════════

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// ── Servizi ───────────────────────────────────────────────────────
import { DogsitterService } from '../../../servizi/dogsitter.service';
import { CaneService }       from '../../../servizi/cane.service';
import { SessionService }    from '../../../servizi/session.service';
import { ServizioService }   from '../../../servizi/servizio.service';

// ── Modelli ───────────────────────────────────────────────────────
import { Dogsitter }                from '../../../modelli/dogsitter.model';
import { Offre, ServizioOfferto }   from '../../../modelli/servizio.model'; // ServizioOfferto = servizio con prezzo/durata
import { Cane }                     from '../../../modelli/cane.model';

// ── Interfaccia locale: un giorno nel calendario di disponibilità ──
interface GiornoDisponibile {
  nomeCorto:   string;   // es. "Mar"
  dataCorta:   string;   // es. "10 Giu"
  data:        Date;     // oggetto Date (per costruire l'ISO string al submit)
  disponibile: boolean;  // dipende dai giorniDisponibili del dogsitter (dal backend)
}

// ── Interfaccia locale: campi del form di prenotazione ────────────
interface FormPrenotazione {
  orario:         string; // slot orario scelto, es. "15:00"
  nMicrochipCane: string; // microchip del cane del cliente
}

@Component({
  selector:    'app-profilo-dogsitter',
  imports:     [CommonModule, FormsModule],
  templateUrl: './info-dogsitter.html',
  styleUrl:    './info-dogsitter.css',
})
export class InfoDogsitter implements OnInit {

  // ── Stato principale ─────────────────────────────────────────────
  dogsitter:   Dogsitter | null     = null; // profilo caricato dal backend
  offerte:     ServizioOfferto[]    = [];   // servizi offerti dal dogsitter
  caniCliente: Cane[]               = [];   // cani del cliente per il <select>
  errore       = false; // true se l'API fallisce → mostra messaggio di errore
  caricamento  = true;  // true finché il profilo non è caricato → spinner

  // ── Stato form prenotazione ───────────────────────────────────────
  offertaSelezionata:  ServizioOfferto | null  = null; // servizio selezionato
  formAperta           = false;                         // visibilità del modal/form
  giorniDisponibili:   GiornoDisponibile[]     = [];
  giornoSelezionato:   GiornoDisponibile | null = null;

  // Slot orari fissi proposti all'utente
  orariDisponibili = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];

  // Dati del form (legati a [(ngModel)])
  prenotazione: FormPrenotazione = { orario: '', nMicrochipCane: '' };

  toastVisibile = false; // visibilità del toast di conferma

  constructor(
    private route:        ActivatedRoute,
    private router:       Router,
    private dogsitterSrv: DogsitterService,
    private caneSrv:      CaneService,
    private session:      SessionService,
    private servizioSrv:  ServizioService,
  ) {}

  // ── Lifecycle hook ────────────────────────────────────────────────
  ngOnInit(): void {
    // Legge il parametro :username dall'URL (es. /dogsitter/mario_rossi)
    const username = this.route.snapshot.paramMap.get('username') ?? '';
    if (!username) { this.errore = true; this.caricamento = false; return; }

    // Carica il profilo del dogsitter dal backend
    this.dogsitterSrv.getByUser(username).subscribe({
      next: (res: Dogsitter) => {
        this.dogsitter   = res;
        this.caricamento = false;
        // Genera il calendario usando i giorni disponibili salvati nel profilo
        // (es. ["lunedì", "mercoledì", "venerdì"])
        this.generaGiorni(res.giorniDisponibili);
        this.caricaServizi(username); // carica i servizi offerti da questo dogsitter
      },
      error: () => { this.errore = true; this.caricamento = false; },
    });

    // Carica i cani del cliente loggato (per il <select> nel form)
    const utente = this.session.getLoggedUser();
    if (utente?.username) {
      this.caneSrv.getByCliente(utente.username).subscribe({
        next:  (res: Cane[]) => { this.caniCliente = res ?? []; },
        error: ()            => { this.caniCliente = []; },
      });
    }
  }

  // ── Carica i servizi offerti da questo dogsitter ──────────────────
  // Separato da ngOnInit per chiarezza e per poter essere richiamato
  // in modo indipendente se necessario
  caricaServizi(username: string): void {
    this.servizioSrv.getServiziBySitter(username).subscribe({
      next:  (res: ServizioOfferto[]) => { this.offerte = res ?? []; },
      error: ()                       => { this.offerte = []; },
    });
  }

  // ── Genera il calendario dei prossimi 14 giorni ───────────────────
  // A differenza di info-campo, qui la disponibilità è personalizzata:
  // viene letta dai giorniDisponibili del profilo dogsitter (backend).
  // Se il backend non fornisce giorni → fallback: tutti tranne domenica.
  generaGiorni(giorniBackend: string[] = []): void {
    // Nomi completi in italiano (usati per confrontare con il backend)
    const nomi  = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
    const brevi = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    const mesi  = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    const oggi  = new Date(); oggi.setHours(0,0,0,0);

    // Set per lookup O(1): "lunedì" → true se il dogsitter lavora quel giorno
    const dispSet = new Set(giorniBackend.map(g => g.toLowerCase()));

    this.giorniDisponibili = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(oggi);
      d.setDate(oggi.getDate() + i);

      // Se il backend ha fornito giorni → usa quelli; altrimenti escludi solo domenica
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

  // ── Formatta una durata in minuti in stringa leggibile ────────────
  // es.  90 → "1h 30min"   |   60 → "1h"   |   45 → "45min"
  // Usato nel template per mostrare la durata di ogni servizio
  formatDurata(minuti: number): string {
    if (!minuti) return '';
    const h   = Math.floor(minuti / 60);
    const min = minuti % 60;
    if (h && min) return `${h}h ${min}min`;
    if (h)        return `${h}h`;
    return `${min}min`;
  }

  // ── Apre il form per un'offerta specifica ─────────────────────────
  // Resetta sempre i campi per evitare dati residui
  apriForm(offerta: ServizioOfferto): void {
    this.offertaSelezionata = offerta;
    this.formAperta         = true;
    this.giornoSelezionato  = null;
    this.prenotazione       = { orario: '', nMicrochipCane: '' };
  }

  // ── Chiude il form ────────────────────────────────────────────────
  chiudiForm(): void {
    this.formAperta         = false;
    this.offertaSelezionata = null;
  }

  // ── Seleziona un giorno dal calendario ────────────────────────────
  // Resetta l'orario perché il giorno cambia
  selezionaGiorno(g: GiornoDisponibile): void {
    if (!g.disponibile) return;
    this.giornoSelezionato   = g;
    this.prenotazione.orario = '';
  }

  // ── Getter: abilita il bottone "Prenota" solo se il form è completo ──
  get formValida(): boolean {
    return !!this.giornoSelezionato &&
           !!this.prenotazione.orario &&
           !!this.prenotazione.nMicrochipCane;
  }

  // ── Costruisce e invia il payload di prenotazione ─────────────────
  confermaPrenotazione(): void {
    if (!this.formValida) return;

    const payload = {
      tipo:              'servizio',
      usernameDogsitter: this.dogsitter?.username,
      categoriaServizio: this.offertaSelezionata?.categoria,
      prezzoListino:     this.offertaSelezionata?.prezzoListino,
      durataMinuti:      this.offertaSelezionata?.durata,
      // toISOString() → "2024-07-01T00:00:00.000Z"
      // split('T')[0] → "2024-07-01"
      giorno:            this.giornoSelezionato!.data.toISOString().split('T')[0],
      orario:            this.prenotazione.orario,
      nMicrochipCane:    this.prenotazione.nMicrochipCane,
    };

    // TODO: sostituire con → this.prenotazioneSrv.crea(payload).subscribe(...)
    console.log('Prenotazione dogsitter:', payload);

    this.chiudiForm();
    this.mostraToast();
  }

  // ── Mostra il toast di conferma per 3.5 secondi poi lo nasconde ───
  mostraToast(): void {
    this.toastVisibile = true;
    setTimeout(() => { this.toastVisibile = false; }, 3500);
  }

  // ── Torna alla dashboard del cliente ──────────────────────────────
  torna(): void {
    this.router.navigate(['/home-cliente']);
  }
}