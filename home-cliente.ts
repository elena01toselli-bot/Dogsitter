// ════════════════════════════════════════════════════════════════════
//  HOME-CLIENTE  –  componente "dashboard" del cliente
//  È il layout principale: contiene la sidebar + la home-view con
//  la lista di dogsitter e campi filtrabili.
// ════════════════════════════════════════════════════════════════════

import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterOutlet,          // necessario per il <router-outlet> nel template (rotte figlie)
  RouterLink,            // direttiva [routerLink] sulle card/voci menu
  RouterLinkActive,      // aggiunge classe CSS quando la rotta è attiva
  NavigationEnd          // evento emesso dal Router quando la navigazione è completata
} from '@angular/router';
import { CommonModule } from '@angular/common';   // *ngIf, *ngFor, async pipe…
import { FormsModule } from '@angular/forms';     // [(ngModel)] sui campi filtro
import { filter } from 'rxjs/operators';          // filtra lo stream degli eventi router

// ── Servizi iniettati via DI ──────────────────────────────────────
import { DogsitterService }         from '../../servizi/dogsitter.service';
import { CampoAddestramentoService } from '../../servizi/campo-addestramento.service';
import { SessionService }            from '../../servizi/session.service';

// ── Modelli (interfacce TypeScript che rispecchiano il backend) ───
import { Dogsitter }         from '../../modelli/dogsitter.model';
import { CampoAddestramento } from '../../modelli/campo-addestramento.model';

@Component({
  selector: 'app-home-cliente',
  standalone: true,   // componente autonomo: non ha bisogno di un NgModule
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './home-cliente.html',
  styleUrl:    './home-cliente.css',
})
export class HomeCliente implements OnInit {

  // ── Sidebar ───────────────────────────────────────────────────────
  sidebarAperta: boolean = false;  // true = sidebar espansa, false = collassata
  nomeCliente:   string  = 'Cliente'; // nome visualizzato nell'avatar sidebar

  // ── Visibilità della home-view ────────────────────────────────────
  // La home-view (lista card) viene mostrata SOLO quando l'URL è
  // esattamente /home-cliente; nascosta quando si naviga verso una
  // sotto-rotta (es. /home-cliente/dogsitter/mario).
  mostraHome: boolean = true;

  // ── Dati grezzi ricevuti dal backend ─────────────────────────────
  dogsitters: Dogsitter[]         = [];
  campi:      CampoAddestramento[] = [];

  // ── Dati filtrati mostrati nel template ───────────────────────────
  filteredDogsitters: Dogsitter[]         = [];
  filteredCampi:      CampoAddestramento[] = [];

  // ── Stato dei filtri (legati agli input nel template con ngModel) ─
  filtroTipo:   string = 'tutti'; // tab "Tutti / Dogsitter / Campi"
  filtroTaglia: string = '';      // taglia cane (piccola/media/grande…)
  filtroCitta:  string = '';      // testo libero su città/provincia
  taglieDisponibili: string[] = []; // opzioni del <select> taglia

  constructor(
    private router:     Router,
    private dogsitterSrv: DogsitterService,
    private campoSrv:     CampoAddestramentoService,
    private session:      SessionService,
  ) {}

  // ── Lifecycle hook: eseguito una volta al mount del componente ────
  ngOnInit(): void {
    // Legge il nome utente dalla sessione e lo mostra nella sidebar
    const utente = this.session.getLoggedUser();
    if (utente?.username) this.nomeCliente = utente.username;

    // Ascolta ogni cambio di rotta: aggiorna mostraHome di conseguenza.
    // filter() scarta tutti gli eventi che NON sono NavigationEnd
    // (es. NavigationStart, RoutesRecognized…)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.mostraHome =
          e.urlAfterRedirects === '/home-cliente' ||
          e.urlAfterRedirects === '/home-cliente/';
      });

    // Controlla anche al caricamento iniziale (il subscribe sopra
    // si attiva solo per le navigazioni successive)
    const url = this.router.url;
    this.mostraHome = url === '/home-cliente' || url === '/home-cliente/';

    // Avvia il caricamento parallelo di dogsitter e campi
    this.loadDogsitters();
    this.loadCampi();
  }

  // ── Caricamento dogsitter dal backend ─────────────────────────────
  loadDogsitters(): void {
    this.dogsitterSrv.getAll().subscribe({
      next: (res) => {
        this.dogsitters = res || [];
        this.extractTaglie();  // popola il <select> con le taglie uniche
        this.applyFilters();   // aggiorna la lista filtrata
      },
      error: () => {
        // In caso di errore API svuota la lista ed aggiorna i filtri
        this.dogsitters = [];
        this.applyFilters();
      }
    });
  }

  // ── Caricamento campi di addestramento dal backend ────────────────
  loadCampi(): void {
    this.campoSrv.getAll().subscribe({
      next:  (res) => { this.campi = res || []; this.applyFilters(); },
      error: ()    => { this.campi = [];         this.applyFilters(); }
    });
  }

  // ── Estrae le taglie uniche da tutti i dogsitter ──────────────────
  // Serve per popolare dinamicamente il <select> delle taglie nel filtro,
  // mostrando solo quelle effettivamente offerte dai dogsitter presenti.
  extractTaglie(): void {
    const set = new Set<string>();
    this.dogsitters.forEach(d =>
      (d.taglieCani || []).forEach((t: string) => set.add(t))
    );
    // Ordine alfabetico per coerenza visiva
    this.taglieDisponibili = Array.from(set).sort();
  }

  // ── Applica i filtri attivi su dogsitter e campi ──────────────────
  // Viene chiamata ogni volta che un filtro cambia o i dati vengono
  // (ri)caricati dal backend.
  applyFilters(): void {
    const tag   = this.filtroTaglia?.toLowerCase();
    const citta = this.filtroCitta?.toLowerCase();

    // Filtra dogsitter: devono soddisfare ENTRAMBE le condizioni attive
    this.filteredDogsitters = this.dogsitters.filter(d => {
      const matchTag   = !tag   || (d.taglieCani || [])
                                    .map((x: string) => x.toLowerCase())
                                    .includes(tag);
      const matchCitta = !citta || (d.provincia || '').toLowerCase().includes(citta);
      return matchTag && matchCitta;
    });

    // Filtra campi: solo per città (i campi non hanno taglie)
    // Cerca sia in "provincia" sia in "via" per maggiore flessibilità
    this.filteredCampi = this.campi.filter(c => {
      const matchCitta = !citta
        || (c.provincia || '').toLowerCase().includes(citta)
        || (c.via       || '').toLowerCase().includes(citta);
      return matchCitta;
    });
  }

  // ── Callback chiamato dal template al cambio di qualsiasi filtro ──
  onFiltroChange(): void { this.applyFilters(); }

  // ── Resetta tutti i filtri ai valori di default ───────────────────
  resetFiltri(): void {
    this.filtroTipo   = 'tutti';
    this.filtroTaglia = '';
    this.filtroCitta  = '';
    this.applyFilters();
  }

  // ── Apre/chiude la sidebar ────────────────────────────────────────
  toggleSidebar(): void { this.sidebarAperta = !this.sidebarAperta; }

  // ── Effettua il logout ────────────────────────────────────────────
  // Pulisce la sessione (es. rimuove il token da localStorage)
  // e rimanda alla pagina di login (rotta radice "/")
  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/']);
  }

  // ── Utility: codifica un nome per usarlo come parametro URL ───────
  // Usato nel template per costruire i [routerLink] delle card:
  //   [routerLink]="['/dogsitter', encode(d.username)]"
  // Es.: "Mario Rossi" → "Mario%20Rossi"  (spazi sicuri nell'URL)
  encode(nome: string): string {
    return encodeURIComponent(nome ?? '');
  }
}