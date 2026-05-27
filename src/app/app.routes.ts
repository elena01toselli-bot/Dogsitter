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
import { ProfiloCampo } from './features/home-amministratore/profilo-campo/profilo-campo'; // ← Importiamo la nuova componente

// L'array 'routes' definisce tutti i percorsi (URL) della nostra applicazione.
// Ogni oggetto rappresenta una rotta: quando l'URL del browser corrisponde al 'path', 
// Angular carica il 'component' specificato all'interno del <router-outlet>.
export const routes: Routes = [
  
  // 👤 ROTTE CLIENTE (Dashboard con Sidebar)
  // Se l'URL è /home-cliente, carichiamo la componente HomeCliente
  {
    path: 'home-cliente',
    component: HomeCliente,
    // I 'children' sono rotte figlie. Verranno caricate nel <router-outlet> DENTRO HomeCliente.
    children: [
      { path: 'prenotazioni', component: Prenotazioni, data: { ruolo: 'cliente' } },
      { path: 'profilo', component: Profilo, data: { ruolo: 'cliente' } },
      { path: 'form-cane', component: FormCane }, // ← Nuova rotta per il form del cane
      // Se l'utente digita solo /home-cliente, lo rimandiamo a /home-cliente/prenotazioni
      { path: '', redirectTo: 'prenotazioni', pathMatch: 'full' }
    ]
  },
  
  // 📋 ROTTE DOG SITTER (Dashboard con Sidebar)
  {
    path: 'home-dogsitter',
    component: HomeDogsitter,
    children: [
      { path: 'prenotazioni', component: Prenotazioni, data: { ruolo: 'dogsitter' } },
      // con loadComponent usiamo il lazy loading per caricare la componente di 
      // modifica prenotazione solo quando serve, migliorando le performance
      // .then(m => m.ModificaPren): Questo è ciò che accade quando la Promise 
      // viene mantenuta (cioè, quando il file è stato scaricato con successo).
      // na volta che hai finito di scaricare il file, prendi la classe ModificaPren 
      // da lì e usala per questa rotta Senza Lazy Loading: L'utente, appena apre la tua app, dovrebbe scaricare un unico, gigantesco file JavaScript che contiene tutti e 100 i componenti, anche se in quella sessione ne userà solo 5. Questo rende il caricamento iniziale lentissimo.
      // Con il Lazy Loading: L'utente scarica solo un piccolo file iniziale con i componenti essenziali. 
      // Poi, man mano che naviga nell'applicazione e visita nuove sezioni (come "modifica-prenotazione"), il browser scarica solo i piccoli file
      // JavaScript necessari per quella specifica sezione, solo quando servono.
      {path:"modifica-prenotazione", loadComponent: () => import('./features/shared/prenotazioni/modifica-pren/modifica-pren').then(m => m.ModificaPren), data: { ruolo: 'dogsitter' } },
      { path: 'profilo', component: Profilo, data: { ruolo: 'dogsitter' } },
      { path: 'form-servizio', component: FormServizio }, // ← Nuova rotta per il form dei servizi
      { path: '', redirectTo: 'prenotazioni', pathMatch: 'full' }
    ]
  },

  // 👑 ROTTE AMMINISTRATORE (Menu principale a Card)
  {
    path: 'home-amministratore',
    component: HomeAmministratore
  },
  // Sotto-pagine Amministratore (non usano router-outlet in HomeAmministratore per non mostrare le card)
  { path: 'home-amministratore/lista-cdc', component: ListaCDC },
  { path: 'home-amministratore/profilo', component: Profilo },
  { path: 'home-amministratore/profilo-campo', component: ProfiloCampo },

  // Percorsi extra utili (opzionali, es. form o recensioni se non sono sotto-rotte)
  { path: 'lascia-recensione', component: Recensioni },
  
  // Rotta per modificare una prenotazione (usata sia dal cliente che dal dogsitter)
  { path: 'modifica-prenotazione', loadComponent: () => import('./features/shared/prenotazioni/modifica-pren/modifica-pren').then(m => m.ModificaPren) },

  // Rotta di fallback: se l'utente digita un URL inesistente (es. /pagina-a-caso), 
  // viene catturato da '**' e rimandato in modo sicuro alla home-dogsitter (o altra pagina di login).
  { path: '**', redirectTo: 'home-dogsitter' }
];