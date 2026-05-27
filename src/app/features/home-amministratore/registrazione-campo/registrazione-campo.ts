// src/app/features/login/registrazione-campo/registrazione-campo.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CampoAddestramentoService } from '../../../servizi/campo-addestramento.service';
import { LezioneService } from '../../../servizi/lezione.service';
import { CampoAddestramento } from '../../../modelli/campo-addestramento.model';
import { Lezione } from '../../../modelli/lezioni.model';

@Component({
  selector: 'app-registrazione-campo',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrazione-campo.html',
  styleUrl: './registrazione-campo.css',
})
export class RegistrazioneCampo implements OnInit {

  // ── Modalità ──────────────────────────────────────────────────
  isModifica    = false;
  nomeOriginale = '';

  // ── Form campo ────────────────────────────────────────────────
  campo: CampoAddestramento = {
    nome: '', via: '', nCivico: '', cap: '', provincia: '', nTel: '', orarioApertura: '',
  };

  // ── Lezioni associate ─────────────────────────────────────────
  lezioni:          Lezione[]    = [];
  nuovaLezione:     Lezione      = this.lezioneVuota();
  lezioneEditIndex: number | null = null;

  // ── UI state ──────────────────────────────────────────────────
  salvato           = false;
  errore            = '';
  caricamento       = false;
  mostraFormLezione = false;

  constructor(
    private route:     ActivatedRoute,
    private router:    Router,
    private campoSrv:  CampoAddestramentoService,
    private lezioneSrv: LezioneService,
  ) {}

  ngOnInit(): void {
    const nome = this.route.snapshot.paramMap.get('nome');
    if (nome) {
      this.isModifica    = true;
      this.nomeOriginale = decodeURIComponent(nome);
      this.caricaCampo(this.nomeOriginale);
    }
  }

  // ── Carica dati ───────────────────────────────────────────────

  caricaCampo(nome: string): void {
    this.caricamento = true;
    this.campoSrv.getByNome(nome).subscribe({
      next: (res: CampoAddestramento) => {
        this.campo       = { ...res };
        this.caricamento = false;
        this.caricaLezioni(nome);
      },
      error: () => {
        this.errore      = 'Campo non trovato.';
        this.caricamento = false;
      },
    });
  }

  caricaLezioni(nome: string): void {
    this.lezioneSrv.getByCampo(nome).subscribe({
      next:  (res: Lezione[]) => { this.lezioni = res ?? []; },
      error: ()               => { this.lezioni = []; },
    });
  }

  // ── Salva campo ───────────────────────────────────────────────

  salva(): void {
    this.errore = '';
    if (!this.campoValido()) return;

    const obs = this.isModifica
      ? this.campoSrv.update(this.campo)
      : this.campoSrv.create(this.campo);

    obs.subscribe({
      next: () => {
        this.salvato = true;
        setTimeout(() => this.router.navigate(['/home-amministratore/lista-cdc']), 1500);
      },
      error: (e: { status?: number }) => {
        this.errore = e?.status === 409
          ? 'Esiste già un campo con questo nome.'
          : 'Errore durante il salvataggio. Riprova.';
      },
    });
  }

  // ── Validazione ───────────────────────────────────────────────

  campoValido(): boolean {
    if (!this.campo.nome.trim())     { this.errore = 'Il nome è obbligatorio.';         return false; }
    if (!this.campo.via.trim())      { this.errore = 'La via è obbligatoria.';          return false; }
    if (!/^\d{5}$/.test(this.campo.cap)) { this.errore = 'CAP non valido (5 cifre).';  return false; }
    if (!this.campo.provincia.trim()) { this.errore = 'La provincia è obbligatoria.';  return false; }
    return true;
  }

  // ── Gestione lezioni ──────────────────────────────────────────

  private lezioneVuota(): Lezione {
    return { nomeCampo: '', ora: '', data: '', tipologia: '', costo: 0, maxPartecipanti: 0 };
  }

  apriFormLezione(index?: number): void {
    if (index !== undefined) {
      this.lezioneEditIndex = index;
      this.nuovaLezione     = { ...this.lezioni[index] };
    } else {
      this.lezioneEditIndex    = null;
      this.nuovaLezione        = this.lezioneVuota();
      this.nuovaLezione.nomeCampo = this.campo.nome;
    }
    this.mostraFormLezione = true;
  }

  chiudiFormLezione(): void {
    this.mostraFormLezione = false;
    this.nuovaLezione      = this.lezioneVuota();
    this.lezioneEditIndex  = null;
  }

  salvaLezione(): void {
    if (!this.nuovaLezione.data || !this.nuovaLezione.ora || !this.nuovaLezione.tipologia) return;
    this.nuovaLezione.nomeCampo = this.campo.nome;

    if (this.lezioneEditIndex !== null) {
      const idx = this.lezioneEditIndex;
      this.lezioneSrv.update(this.nuovaLezione).subscribe({
        next:  (res: Lezione) => { this.lezioni[idx] = res; this.chiudiFormLezione(); },
        error: ()             => { this.errore = 'Errore aggiornamento lezione.'; },
      });
    } else {
      this.lezioneSrv.create(this.nuovaLezione).subscribe({
        next:  (res: Lezione) => { this.lezioni = [...this.lezioni, res]; this.chiudiFormLezione(); },
        error: ()             => { this.errore = 'Errore creazione lezione.'; },
      });
    }
  }

  eliminaLezione(index: number): void {
    const l = this.lezioni[index];
    if (!confirm(`Eliminare la lezione del ${l.data} alle ${l.ora}?`)) return;
    this.lezioneSrv.delete(l.nomeCampo, l.ora, l.data).subscribe({
      next:  () => { this.lezioni = this.lezioni.filter((_, i) => i !== index); },
      error: () => { this.errore = 'Errore eliminazione lezione.'; },
    });
  }

  // ── Navigazione ───────────────────────────────────────────────

  annulla(): void {
    this.router.navigate(['/home-amministratore/lista-cdc']);
  }
}