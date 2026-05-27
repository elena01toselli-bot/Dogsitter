import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Il file main.ts è il punto di ingresso (entry point) dell'intera applicazione Angular.
// Quando il browser carica il sito, questo è il primo codice TypeScript che viene eseguito.

// bootstrapApplication: Questa funzione "avvia" l'applicazione indicando quale è la 
// componente "Radice" (in questo caso 'App', che corrisponde al tag <app-root> in index.html).
// Le passiamo anche 'appConfig' che contiene le impostazioni globali (es. il sistema di routing).
bootstrapApplication(App, appConfig)
  // Se c'è un errore durante l'avvio, lo stampiamo nella console del browser
  .catch((err) => console.error(err));
