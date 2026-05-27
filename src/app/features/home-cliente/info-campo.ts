import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CampoAddestramentoService } from '../../servizi/campo-addestramento.service';
import { LezioneService } from '../../servizi/lezione.service';
import { CaneService } from '../../servizi/cane.service';
import { SessionService } from '../../servizi/session.service';
import { CampoAddestramento } from '../../modelli/campo-addestramento.model';
import { Lezione } from '../../modelli/lezioni.model';
import { Cane } from '../../modelli/cane.model';

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
  selector: 'app-profilo-campo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info-campo.html',
  styleUrl: './info-campo.css',
})
export class ProfiloCampo implements OnInit {

  campo: CampoAddestramento | null = null;
  lezioni: Lezione[] = [];
  caniCliente: Cane[] = [];
  errore = false;
  caricamento = true;

  lezioneSelezionata: Lezione | null = null;
  formAperta = false;

  giorniDisponibili: GiornoDisponibile[] = [];
  giornoSelezionato: GiornoDisponibile | null = null;
  orariDisponibili = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];

  prenotazione: FormPrenotazione = { orario: '', nMicrochipCane: '' };
  toastVisibile = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campoSrv: CampoAddestramentoService,
    private lezioneSrv: LezioneService,
    private caneSrv: CaneService,
    private session: SessionService,
  ) {}

  ngOnInit(): void {
    const nome = decodeURIComponent(this.route.snapshot.paramMap.get('nome') ?? '');
    if (!nome) { this.errore = true; this.caricamento = false; return; }

    this.campoSrv.getByNome(nome).subscribe({
      next: (res) => {
        this.campo = res;
        this.caricamento = false;
        this.caricaLezioni(res.nome);
        this.generaGiorni();
      },
      error: () => { this.errore = true; this.caricamento = false; }
    });

    const utente = this.session.getLoggedUser();
    if (utente?.username) {
      this.caneSrv.getByCliente(utente.username).subscribe({
        next: (res) => { this.caniCliente = res || []; },
        error: () => { this.caniCliente = []; }
      });
    }
  }

  caricaLezioni(nomeCampo: string): void {
    this.lezioneSrv.getByCampo(nomeCampo).subscribe({
      next: (res) => { this.lezioni = res || []; },
      error: () => { this.lezioni = []; }
    });
  }

  generaGiorni(): void {
    const brevi = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    const mesi  = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    const oggi  = new Date(); oggi.setHours(0,0,0,0);

    this.giorniDisponibili = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(oggi);
      d.setDate(oggi.getDate() + i);
      // I campi di addestramento sono aperti tutti i giorni tranne domenica
      const disponibile = d.getDay() !== 0;
      this.giorniDisponibili.push({
        nomeCorto:  brevi[d.getDay()],
        dataCorta:  `${d.getDate()} ${mesi[d.getMonth()]}`,
        data:       d,
        disponibile,
      });
    }
  }

  apriForm(lezione: Lezione): void {
    this.lezioneSelezionata = lezione;
    this.formAperta = true;
    this.giornoSelezionato = null;
    this.prenotazione = { orario: '', nMicrochipCane: '' };
  }

  chiudiForm(): void {
    this.formAperta = false;
    this.lezioneSelezionata = null;
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
      tipo:           'lezione',
      nomeCampo:      this.campo?.nome,
      tipologia:      this.lezioneSelezionata?.tipologia,
      costo:          this.lezioneSelezionata?.costo,
      giorno:         this.giornoSelezionato!.data.toISOString().split('T')[0],
      orario:         this.prenotazione.orario,
      nMicrochipCane: this.prenotazione.nMicrochipCane,
    };
    // TODO: this.prenotazioneSrv.crea(payload).subscribe(...)
    console.log('Prenotazione lezione:', payload);
    this.chiudiForm();
    this.mostraToast();
  }

  apriRecensioni(lezione: Lezione): void {
    this.router.navigate(['/add-recensioni'], {
      queryParams: {
        tipo:      'lezione',
        nomeCampo: this.campo?.nome,
        tipologia: lezione.tipologia,
      }
    });
  }

  mostraToast(): void {
    this.toastVisibile = true;
    setTimeout(() => { this.toastVisibile = false; }, 3500);
  }

  torna(): void {
    this.router.navigate(['/home-cliente']);
  }
}