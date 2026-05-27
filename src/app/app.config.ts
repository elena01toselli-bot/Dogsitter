import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

// importiamo l'array di rotte che abbiamo definito in app.routes.ts,
//  è fondamentale per abilitare il routing nell'applicazione
import { routes } from './app.routes';

// Importiamo il provider per HttpClient, che è necessario per fare richieste HTTP al backend.
// Senza questo provider, se provassimo a iniettare HttpClient in un componente o servizio, 
// otterremmo un errore di runtime che dice "NullInjectorError: No provider for HttpClient!"
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {

  // qui mettiamo servizi e logiche che devono essere disponibili tramite Dependency Injection (DI) in tutta l'applicazione
  // questo array di providers è fondamentale per abilitare funzionalità chiave di 
  // Angular come il routing e le chiamate HTTP. se non avessi messo 
  // provideHttpClient() qui, qualsiasi componente o servizio che tenta di iniettare HttpClient 
  // fallirebbe con un errore di runtime,perchè grazie a questo gli spiego come creare un'istanza di HttpClient quando 
  // qualcuno lo richiede tramite Dependency Injection
  providers: [

    // Iniettiamo globalmente i listener degli errori del browser citati prima. In questo modo, l'applicazione 
    // è configurata per monitorare le eccezioni fin dal primo istante in cui si avvia nel browser dell'utente
    provideBrowserGlobalErrorListeners(),
    
    // nizializziamo il motore del router di Angular passandogli come argomento l'array routes che abbiamo importato.
    //  Grazie a questa riga, tag come <router-outlet> e direttive come routerLink funzioneranno correttamente in ogni
    //  parte del tuo sito
    provideRouter(routes),
    
    provideHttpClient()
  ]
};
