import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  sidebarAperta: boolean = false;
  nomeCliente: string = 'Cliente';

  dogsitters: Dogsitter[] = [];
  campi: CampoAddestramento[] = [];
  filteredDogsitters: Dogsitter[] = [];
  filteredCampi: CampoAddestramento[] = [];

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
    this.loadDogsitters();
    this.loadCampi();
  }

  loadDogsitters(): void {
    this.dogsitterSrv.getAll().subscribe({
      next: (res) => { this.dogsitters = res || []; this.extractTaglie(); this.applyFilters(); },
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
      const matchCitta = !citta || (c.provincia || '').toLowerCase().includes(citta) || (c.via || '').toLowerCase().includes(citta);
      return matchCitta;
    });
  }

  onFiltroChange(): void { this.applyFilters(); }

  resetFiltri(): void {
    this.filtroTipo = 'tutti'; this.filtroTaglia = ''; this.filtroCitta = '';
    this.applyFilters();
  }

  toggleSidebar(): void { this.sidebarAperta = !this.sidebarAperta; }

  logout(): void { this.session.clearSession(); this.router.navigate(['/']); }

  /** Encode del nome campo per l'URL — chiamato direttamente dal template */
  encode(nome: string): string { return encodeURIComponent(nome ?? ''); }
}