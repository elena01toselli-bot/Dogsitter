import { Routes } from '@angular/router';
import { SceltaRuolo } from './features/login/scelta-ruolo';
import { Login } from './features/login/login';
import { RegistrazioneCliente } from './features/login/registrazione-cliente/registrazione-cliente';
import { RegistrazioneDogsitter } from './features/login/registrazione-dogsitter/registrazione-dogsitter';
import { RegistrazioneCampo } from './features/login/registrazione-campo/registrazione-campo';
import { Profilo } from './features/shared/profilo/profilo';
import { HomeDogsitter } from './features/home-dogsitter/home-dogsitter';
import { HomeCliente } from './features/home-cliente/home-cliente';
import { Prenotazioni } from './features/shared/prenotazioni/prenotazioni';
import { Recensioni } from './features/home-cliente/recensioni/recensioni';
import { AddRecensione } from './features/home-cliente/recensioni/add-recensione/add-recensione';
import { HomeAmministratore } from './features/home-amministratore/home-amministratore';
import { ListaCDC } from './features/home-amministratore/lista-cdc/lista-cdc';
import { FormCane } from './features/shared/profilo/form-cane/form-cane';
import { FormServizio } from './features/shared/profilo/form-servizio/form-servizio';
import { ProfiloCampo as ProfiloCampoAmministratore } from './features/home-amministratore/profilo-campo/profilo-campo';
import { ProfiloDogsitter } from './features/home-cliente/profilo-dogsitter';
import { ProfiloCampo } from './features/home-cliente/profilo-campo';

export const routes: Routes = [

  // ── ENTRY POINT ──────────────────────────────────────────────────────────
  { path: '', component: SceltaRuolo },

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  { path: 'login', component: Login },

  // ── REGISTRAZIONE ────────────────────────────────────────────────────────
  { path: 'registrazione/cliente',   component: RegistrazioneCliente,   data: { ruolo: 'cliente' } },
  { path: 'registrazione/dogsitter', component: RegistrazioneDogsitter, data: { ruolo: 'dogsitter' } },

  // ── HOME CLIENTE ─────────────────────────────────────────────────────────
  {
    path: 'home-cliente',
    component: HomeCliente,
    children: [
      { path: 'prenotazioni',              component: Prenotazioni,       data: { ruolo: 'cliente' } },
      { path: 'profilo',                   component: Profilo,             data: { ruolo: 'cliente' } },
      { path: 'form-cane',                 component: FormCane },
      { path: 'recensioni',                component: Recensioni },
      { path: 'add-recensione',            component: AddRecensione },
      { path: 'profilo-dogsitter/:username', component: ProfiloDogsitter },
      { path: 'profilo-campo/:nome',       component: ProfiloCampo }
    ]
  },

  // ── HOME DOGSITTER ───────────────────────────────────────────────────────
  {
    path: 'home-dogsitter',
    component: HomeDogsitter,
    children: [
      { path: 'prenotazioni', component: Prenotazioni,  data: { ruolo: 'dogsitter' } },
      { path: 'profilo',      component: Profilo,       data: { ruolo: 'dogsitter' } },
      { path: 'form-servizio', component: FormServizio },
    ]
  },

  // ── HOME AMMINISTRATORE ──────────────────────────────────────────────────
  {
    path: 'home-amministratore',
    component: HomeAmministratore
  },
  { path: 'home-amministratore/lista-cdc',        component: ListaCDC },
  { path: 'home-amministratore/profilo',           component: Profilo },
  { path: 'home-amministratore/profilo-campo',     component: ProfiloCampoAmministratore },
  // Rotta per inserimento nuovo campo o modifica esistente
  { path: 'home-amministratore/registrazione-campo',        component: RegistrazioneCampo },
  { path: 'home-amministratore/registrazione-campo/:nome',  component: RegistrazioneCampo },

  // ── ROTTE CONDIVISE ───────────────────────────────────────────────────────
  { path: 'lascia-recensione',  component: Recensioni },
  {
    path: 'modifica-prenotazione',
    loadComponent: () =>
      import('./features/shared/prenotazioni/modifica-pren/modifica-pren')
        .then(m => m.ModificaPren)
  },

  // ── FALLBACK ──────────────────────────────────────────────────────────────
  { path: '**', redirectTo: '' }

];