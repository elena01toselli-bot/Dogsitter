// ════════════════════════════════════════════════════════════════════
//  INFO-CAMPO  –  pagina di dettaglio di un campo di addestramento
//  Mostra le info del campo, le lezioni disponibili e il form
//  per prenotare una singola lezione.
// ════════════════════════════════════════════════════════════════════

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // legge i parametri URL e naviga
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// ── Servizi ──────────────────────────────────────────────────────────
import { CampoAddestramentoService } from '../../servizi/campo-addestramento.service';
import { LezioneService }             from '../../servizi/lezione.service';
import { CaneService }                from '../../servizi/cane.service';
import { SessionService }             from '../../servizi/session.service';

// ── Modelli ───────────────────────────────────────────────────────────
import { CampoAddestramento } from '../../modelli/campo-addestramento.model';
import { Lezione }             from '../../modelli/lezioni.model';
import { Cane }                from '../../modelli/cane.model';

// ── Interfaccia locale: rappresenta un singolo giorno nel calendario ──
// "locale" = usata solo in questo file, non condivisa con il backend
interface GiornoDisponibile {
  nomeCorto:   string;   // es. "Lun"
  dataCorta:   string;   // es. "3 Giu"
  data:        Date;     // oggetto Date completo (serve per costruire l'ISO string)
  disponibile: boolean;  // false = domenica → il bottone sarà disabilitato
}

// ── Interfaccia locale: i campi del form di prenotazione ─────────────
interface FormPrenotazione {
  orario:         string; // es. "10:00"
  nMicrochipCane: string; // microchip del cane selezionato dal cliente
}

@Component({
  selector:     'app-profilo-campo',
  standalone:   true,
  imports:      [CommonModule, FormsModule],
  templateUrl:  './info-campo.html',
  styleUrl:     './info-campo.css',
})
export class ProfiloCampo implements OnInit {

  // ── Stato principale ─────────────────────────────────────────────
  campo:       CampoAddestramento | null = null; // dati del campo caricati dal backend
  lezioni:     Lezione[]                 = [];   // lezioni offerte da questo campo
  caniCliente: Cane[]                    = [];   // cani del cliente loggato (per il <select>)
  errore      = false;  // true se la chiamata API fallisce → mostra messaggio di errore
  caricamento = true;   // true finché i dati non arrivano → mostra spinner/skeleton

  // ── Stato del form di prenotazione ───────────────────────────────
  lezioneSelezionata: Lezione | null = null; // lezione su cui il cliente ha cliccato "Prenota"
  formAperta         = false;                // controlla la visibilità del form/modal

  // ── Calendario dei prossimi 14 giorni ────────────────────────────
  giorniDisponibili:  GiornoDisponibile[]     = [];
  giornoSelezionato:  GiornoDisponibile | null = null; // giorno scelto dal cliente

  // Orari fissi proposti (slot da 1h)
  orariDisponibili = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];

  // Dati del form (legati a [(ngModel)] nel template)
  prenotazione: FormPrenotazione = { orario: '', nMicrochipCane: '' };

  // Controlla la visibilità del toast di conferma
  toastVisibile = false;

  constructor(
    private route:     ActivatedRoute,             // legge :nome dall'URL
    private router:    Router,
    private campoSrv:  CampoAddestramentoService,
    private lezioneSrv: LezioneService,
    private caneSrv:   CaneService,
    private session:   SessionService,
  ) {}

  // ── Lifecycle hook ────────────────────────────────────────────────
  ngOnInit(): void {
    // Legge il parametro :nome dall'URL (es. /campo/Centro%20Cinofilo)
    // decodeURIComponent inverte l'encode fatto in home-cliente (encode())
    const nome = decodeURIComponent(
      this.route.snapshot.paramMap.get('nome') ?? ''
    );

    // Se il parametro è assente mostra errore senza chiamare il backend
    if (!nome) { this.errore = true; this.caricamento = false; return; }

    // Carica i dati del campo dal backend tramite il nome
    this.campoSrv.getByNome(nome).subscribe({
      next: (res) => {
        this.campo       = res;
        this.caricamento = false;
        this.caricaLezioni(res.nome); // carica le lezioni di QUESTO campo
        this.generaGiorni();           // costruisce il calendario 14 giorni
      },
      error: () => { this.errore = true; this.caricamento = false; }
    });

    // Carica i cani del cliente loggato per il <select> nel form
    const utente = this.session.getLoggedUser();
    if (utente?.username) {
      this.caneSrv.getByCliente(utente.username).subscribe({
        next:  (res) => { this.caniCliente = res || []; },
        error: ()    => { this.caniCliente = []; }
      });
    }
  }

  // ── Carica le lezioni associate al campo ──────────────────────────
  caricaLezioni(nomeCampo: string): void {
    this.lezioneSrv.getByCampo(nomeCampo).subscribe({
      next:  (res) => { this.lezioni = res || []; },
      error: ()    => { this.lezioni = []; }
    });
  }

  // ── Genera il calendario dei prossimi 14 giorni ───────────────────
  // I campi sono aperti tutti i giorni TRANNE la domenica (getDay() === 0)
  generaGiorni(): void {
    const brevi = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    const mesi  = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    const oggi  = new Date(); oggi.setHours(0,0,0,0); // mezzanotte di oggi

    this.giorniDisponibili = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(oggi);
      d.setDate(oggi.getDate() + i); // giorno = oggi + i
      const disponibile = d.getDay() !== 0; // domenica → non disponibile
      this.giorniDisponibili.push({
        nomeCorto:  brevi[d.getDay()],
        dataCorta:  `${d.getDate()} ${mesi[d.getMonth()]}`,
        data:       d,
        disponibile,
      });
    }
  }

  // ── Apre il form di prenotazione per una specifica lezione ────────
  // Resetta tutti i campi per evitare dati residui da prenotazioni precedenti
  apriForm(lezione: Lezione): void {
    this.lezioneSelezionata = lezione;
    this.formAperta         = true;
    this.giornoSelezionato  = null;
    this.prenotazione       = { orario: '', nMicrochipCane: '' };
  }

  // ── Chiude il form e deseleziona la lezione ───────────────────────
  chiudiForm(): void {
    this.formAperta         = false;
    this.lezioneSelezionata = null;
  }

  // ── Seleziona un giorno nel calendario ────────────────────────────
  // Resetta l'orario perché il nuovo giorno potrebbe avere slot diversi
  selezionaGiorno(g: GiornoDisponibile): void {
    if (!g.disponibile) return; // ignora click su domenica
    this.giornoSelezionato   = g;
    this.prenotazione.orario = ''; // l'utente deve ri-scegliere l'orario
  }

  // ── Getter: true solo quando il form è compilato correttamente ────
  // Usato nel template per abilitare/disabilitare il bottone "Prenota"
  get formValida(): boolean {
    return !!this.giornoSelezionato &&
           !!this.prenotazione.orario &&
           !!this.prenotazione.nMicrochipCane;
  }

  // ── Invia la prenotazione al backend ─────────────────────────────
  // Per ora logga il payload in console (TODO: chiamata HTTP reale)
  confermaPrenotazione(): void {
    if (!this.formValida) return;

    const payload = {
      tipo:           'lezione',
      nomeCampo:      this.campo?.nome,
      tipologia:      this.lezioneSelezionata?.tipologia,
      costo:          this.lezioneSelezionata?.costo,
      // toISOString() → "2024-07-01T00:00:00.000Z"
      // split('T')[0] → "2024-07-01"  (solo la data, senza orario)
      giorno:         this.giornoSelezionato!.data.toISOString().split('T')[0],
      orario:         this.prenotazione.orario,
      nMicrochipCane: this.prenotazione.nMicrochipCane,
    };

    // TODO: sostituire con → this.prenotazioneSrv.crea(payload).subscribe(...)
    console.log('Prenotazione lezione:', payload);

    this.chiudiForm();   // chiude il form
    this.mostraToast();  // feedback visivo all'utente
  }

  // ── Naviga alla pagina per aggiungere una recensione ─────────────
  // Passa i dati della lezione come queryParam invece che come
  // segmenti di rotta, perché sono parametri opzionali di contesto
  apriRecensioni(lezione: Lezione): void {
    this.router.navigate(['/add-recensioni'], {
      queryParams: {
        tipo:      'lezione',
        nomeCampo: this.campo?.nome,
        tipologia: lezione.tipologia,
      }
    });
  }

  // ── Mostra il toast di conferma per 3.5 secondi ───────────────────
  mostraToast(): void {
    this.toastVisibile = true;
    setTimeout(() => { this.toastVisibile = false; }, 3500);
  }

  // ── Torna alla home del cliente ───────────────────────────────────
  torna(): void {
    this.router.navigate(['/home-cliente']);
  }
}