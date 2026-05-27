// Importiamo Component da @angular/core: è il decoratore che trasforma una classe TypeScript
// in un componente Angular, aggiungendogli metadati come il template HTML e il file CSS.
import { Component } from '@angular/core';

// Router è il servizio di Angular che permette di navigare tra le pagine (route) dell'applicazione
// senza ricaricare il browser — è la navigazione SPA (Single Page Application).
import { Router } from '@angular/router';


// @Component è un decoratore: una funzione speciale (riconoscibile dal @) che "decora" la classe
// sottostante aggiungendole informazioni extra. Angular legge questi metadati per sapere
// come costruire e visualizzare il componente.
@Component({

  // selector: il nome del tag HTML personalizzato con cui questo componente
  // può essere inserito in altri template. Se scrivi <app-scelta-ruolo> in un HTML,
  // Angular lo sostituisce con il contenuto di scelta-ruolo.html.
  // Il prefisso "app-" è una convenzione per distinguere i tag Angular da quelli HTML nativi.
  selector: 'app-scelta-ruolo',

  // imports: array dei moduli Angular necessari nel template di questo componente.
  // Qui è vuoto perché il template usa solo event binding nativi del browser (click),
  // che non richiedono import aggiuntivi.
  imports: [],

  // templateUrl: percorso del file HTML che definisce la struttura visiva del componente.
  templateUrl: './scelta-ruolo.html',

  // styleUrl: percorso del file CSS che definisce lo stile visivo del componente.
  styleUrl: './scelta-ruolo.css',

})

// "export" rende questa classe importabile in altri file del progetto (es. app.routes.ts).
// SceltaRuolo è il nome della classe: per convenzione Angular usa PascalCase per i componenti.
export class SceltaRuolo {

  // Il costruttore viene eseguito da Angular quando crea un'istanza del componente.
  // "private router: Router" è la sintassi di Dependency Injection (DI) di Angular:
  // invece di creare noi un new Router(), diciamo ad Angular "dammi il Router che gestisci tu".
  // Angular mantiene una sola istanza globale del Router condivisa da tutta l'app (pattern Singleton).
  // "private" crea automaticamente la proprietà this.router — è una scorciatoia TypeScript
  // equivalente a scrivere: this.router = router; dentro il costruttore.
  constructor(private router: Router) {}


  // navigateTo viene chiamato dal template quando l'utente clicca su una card.
  // Riceve come parametro il ruolo scelto: 'cliente', 'dogsitter' o 'amministratore'.
  // "void" significa che la funzione non restituisce nessun valore.
  navigateTo(ruolo: string): void {

    // this.router.navigate naviga verso un'altra route senza ricaricare la pagina.
    // Il primo argomento è un array di segmenti del path: ['/login'] produce l'URL /login.
    // Il secondo argomento è un oggetto opzioni: queryParams aggiunge parametri alla query string.
    // Il risultato finale sarà un URL tipo:
    //   /login?ruolo=cliente
    //   /login?ruolo=dogsitter
    //   /login?ruolo=amministratore
    // La pagina di login leggerà questo parametro con ActivatedRoute per sapere chi sta accedendo.
    this.router.navigate(['/login'], { queryParams: { ruolo: ruolo } });
  }

}