import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { DogsitterService } from '../../servizi/dogsitter.service';
import { CampoAddestramentoService } from '../../servizi/campo-addestramento.service';
import { SessionService } from '../../servizi/session.service';
import { Dogsitter } from '../../modelli/dogsitter.model';
import { CampoAddestramento } from '../../modelli/campo-addestramento.model';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente implements OnInit {

  // ── Sidebar ──────────────────────────────────────────
  sidebarAperta: boolean = false;
  nomeCliente: string = 'Cliente';

  // ── Mostra home-view solo sulla rotta radice ──────────
  mostraHome: boolean = true;

  // ── Dati ─────────────────────────────────────────────
  dogsitters: Dogsitter[] = [];
  campi: CampoAddestramento[] = [];
  filteredDogsitters: Dogsitter[] = [];
  filteredCampi: CampoAddestramento[] = [];

  // ── Filtri ────────────────────────────────────────────
  filtroTipo: string = 'tutti';
  filtroTaglia: string = '';
  filtroCitta: string = '';
  taglieDisponibili: string[] = [];

  constructor(
    private router: Router,
    private dogsitterSrv: DogsitterService,
    private campoSrv: CampoAddestramentoService,
    private session: SessionService,
  ) {}

  ngOnInit(): void {
    const utente = this.session.getLoggedUser();
    if (utente?.username) this.nomeCliente = utente.username;

    // Controlla la rotta attuale ad ogni navigazione
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        // mostra home-view solo se l'URL è esattamente /home-cliente
        this.mostraHome = e.urlAfterRedirects === '/home-cliente'
                       || e.urlAfterRedirects === '/home-cliente/';
      });

    // Controlla anche al caricamento iniziale
    const url = this.router.url;
    this.mostraHome = url === '/home-cliente' || url === '/home-cliente/';

    this.loadDogsitters();
    this.loadCampi();
  }

  // ── Caricamento ───────────────────────────────────────

  loadDogsitters(): void {
    this.dogsitterSrv.getAll().subscribe({
      next: (res) => {
        this.dogsitters = res || [];
        this.extractTaglie();
        this.applyFilters();
      },
      error: () => { this.dogsitters = []; this.applyFilters(); }
    });
  }

  loadCampi(): void {
    this.campoSrv.getAll().subscribe({
      next: (res) => { this.campi = res || []; this.applyFilters(); },
      error: () => { this.campi = []; this.applyFilters(); }
    });
  }

  extractTaglie(): void {
    const set = new Set<string>();
    this.dogsitters.forEach(d => (d.taglieCani || []).forEach((t: string) => set.add(t)));
    this.taglieDisponibili = Array.from(set).sort();
  }

  applyFilters(): void {
    const tag   = this.filtroTaglia?.toLowerCase();
    const citta = this.filtroCitta?.toLowerCase();

    this.filteredDogsitters = this.dogsitters.filter(d => {
      const matchTag   = !tag   || (d.taglieCani || []).map((x: string) => x.toLowerCase()).includes(tag);
      const matchCitta = !citta || (d.provincia  || '').toLowerCase().includes(citta);
      return matchTag && matchCitta;
    });

    this.filteredCampi = this.campi.filter(c => {
      const matchCitta = !citta
        || (c.provincia || '').toLowerCase().includes(citta)
        || (c.via       || '').toLowerCase().includes(citta);
      return matchCitta;
    });
  }

  // ── Filtri UI ─────────────────────────────────────────

  onFiltroChange(): void { this.applyFilters(); }

  resetFiltri(): void {
    this.filtroTipo   = 'tutti';
    this.filtroTaglia = '';
    this.filtroCitta  = '';
    this.applyFilters();
  }

  // ── Sidebar ───────────────────────────────────────────

  toggleSidebar(): void { this.sidebarAperta = !this.sidebarAperta; }

  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/']);
  }

  encode(nome: string): string {
    return encodeURIComponent(nome ?? '');
  }
}