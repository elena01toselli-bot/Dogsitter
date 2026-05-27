import { Routes } from '@angular/router';
import { Profilo } from './features/shared/profilo/profilo';
import { HomeDogsitter } from './features/home-dogsitter/home-dogsitter';
import { HomeCliente } from './features/home-cliente/home-cliente';
import { Prenotazioni } from './features/shared/prenotazioni/prenotazioni';
import { Recensioni } from './features/home-cliente/recensioni/recensioni';
import { HomeAmministratore } from './features/home-amministratore/home-amministratore';
import { ListaCDC } from './features/home-amministratore/lista-cdc/lista-cdc';
import { FormCane } from './features/shared/profilo/form-cane/form-cane';
import { FormServizio } from './features/shared/profilo/form-servizio/form-servizio';
import { SceltaRuolo } from './features/login/scelta-ruolo';
import { Login } from './features/login/login';
import { RegistrazioneCliente } from './features/login/registrazione-cliente/registrazione-cliente';
import { RegistrazioneDogsitter } from './features/login/registrazione-dogsitter/registrazione-dogsitter';
import { RegistrazioneCampo } from './features/home-amministratore/registrazione-campo/registrazione-campo';
import { InfoDogsitter } from './features/home-cliente/info-dogsitter/info-dogsitter';
import { InfoCampo } from './features/home-cliente/info-campo/info-campo';
import { AddRecensione } from './features/home-cliente/recensioni/add-recensione/add-recensione';

export const routes: Routes = [
  
  //--Entry point: scelta ruolo (login o registrazione)---
  { path: '',component: SceltaRuolo },

  
  // --- ROTTE DI AUTENTICAZIONE E REGISTRAZIONE ---
  { path: 'scelta-ruolo', component: SceltaRuolo },
  { path: 'login', component: Login },
  { path: 'registrazione/cliente', component: RegistrazioneCliente },
  { path: 'registrazione/dogsitter', component: RegistrazioneDogsitter },
  { path: 'registrazione/campo', component: RegistrazioneCampo },

  // --- ROTTE CLIENTE (Dashboard con Sidebar) ---
  {
    path: 'home-cliente',
    component: HomeCliente,
    children: [
      { path: 'prenotazioni', component: Prenotazioni, data: { ruolo: 'cliente' } },
      { path: 'profilo/:username', component: Profilo, data: { ruolo: 'cliente' } },
      { path: 'form-cane', component: FormCane },
      { path: 'info-dogsitter/:username', component: InfoDogsitter },
      { path: 'info-campo/:username', component: InfoCampo },
      { path: 'recensioni', component: Recensioni },
      { path: 'add-recensione', component: AddRecensione },
      { path: 'modifica-prenotazione/:id', loadComponent: () => import('./features/shared/prenotazioni/modifica-pren/modifica-pren').then(m => m.ModificaPren) , data: { ruolo: 'cliente' } },

    ]
  },

  // --- ROTTE DOG SITTER (Dashboard con Sidebar) ---
  {
    path: 'home-dogsitter',
    component: HomeDogsitter,
    children: [
      { path: 'prenotazioni', component: Prenotazioni, data: { ruolo: 'dogsitter' } },

      // loadComponent è usato per caricare il componente di modifica prenotazione in modo lazy, dato che è un componente condiviso e non vogliamo includerlo 
      // nel bundle principale del dogsitter poi con .thnen(m => m.ModificaPren) importiamo dinamicamente il modulo che contiene il componente ModificaPren
      // la data: { ruolo: 'dogsitter' } è un dato che possiamo usare all'interno del componente ModificaPren per adattare il comportamento in base al ruolo dell'utente
      { path: 'modifica-prenotazione/:id', loadComponent: () => import('./features/shared/prenotazioni/modifica-pren/modifica-pren').then(m => m.ModificaPren), data: { ruolo: 'dogsitter' } },
      //cosi invio l'username del dogsitter e il tipo di utente (dogsitter) al componente Profilo, che lo userà per caricare 
      // i dati corretti dal backend e mostrare il profilo giusto
      { path: 'profilo/:username', component: Profilo,data: { ruolo: 'dogsitter' } },
      { path: 'form-servizio', component: FormServizio },

    ]
  },

  // --- ROTTE AMMINISTRATORE ---
  { path: 'home-amministratore', component: HomeAmministratore },
  { path: 'home-amministratore/lista-cdc', component: ListaCDC },
  { path: 'home-amministratore/profilo-campo/:nome', component: RegistrazioneCampo },
  { path: 'home-amministratore/profilo', component: Profilo },

  // Rotta di fallback: qualsiasi altro URL non corrispondente viene reindirizzato a 'scelta-ruolo'
  { path: '**', redirectTo: 'scelta-ruolo' }
];