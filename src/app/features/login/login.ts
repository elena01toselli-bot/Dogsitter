// Component: decoratore che trasforma la classe in un componente Angular.
// OnInit: interfaccia che obbliga la classe a implementare ngOnInit(),
//         il metodo che Angular chiama automaticamente dopo aver creato il componente.
import { Component, OnInit } from '@angular/core';

// CommonModule: fornisce le direttive strutturali di Angular come *ngIf (mostra/nasconde elementi)
// e *ngFor (ripete elementi). Senza questo import, *ngIf nel template non funzionerebbe.
import { CommonModule } from '@angular/common';

// FormsModule: abilita il two-way data binding con [(ngModel)].
// "Two-way" significa che se l'utente scrive nel campo input, la variabile TypeScript si aggiorna,
// e se la variabile TypeScript cambia, il campo input si aggiorna — il flusso va in entrambe le direzioni.
import { FormsModule } from '@angular/forms';

// Router: servizio Angular per navigare tra le pagine senza ricaricare il browser.
// ActivatedRoute: servizio Angular che rappresenta la route attiva in questo momento.
// Ci permette di leggere i parametri dell'URL corrente, come il query param ?ruolo=cliente
// passato da SceltaRuolo.
import { Router, ActivatedRoute } from '@angular/router';

// SessionService: servizio personalizzato che gestisce i dati della sessione utente
// (token di autenticazione e dati dell'utente loggato), salvandoli tipicamente nel localStorage.
import { SessionService } from '../../servizi/session.service';

// UtenteService: servizio personalizzato che comunica con il backend tramite HTTP
// per operazioni sugli utenti (login, ricerca per username, ecc.).
import { UtenteService } from '../../servizi/utente.service';

// Utente: interfaccia o classe TypeScript che definisce la struttura di un oggetto utente
// (es. { username, password, email, ruolo, ... }). Usata per tipizzare le variabili.
import { Utente } from '../../modelli/utente.model';


@Component({
  selector: 'app-login',

  // standalone: true indica che questo componente non appartiene a nessun NgModule.
  // È il modo moderno di Angular (v14+): ogni componente dichiara da solo le sue dipendenze
  // nell'array imports qui sotto, invece di affidarsi a un modulo condiviso.
  standalone: true,

  // imports: dichiariamo i moduli che il template di questo componente utilizza.
  // CommonModule → *ngIf
  // FormsModule  → [(ngModel)]
  imports: [CommonModule, FormsModule],

  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {

  // Proprietà legate ai campi del form tramite [(ngModel)].
  // Ogni volta che l'utente scrive nel campo "username", questa variabile si aggiorna in tempo reale,
  // e viceversa. Stesso meccanismo per "password".
  username: string = '';
  password: string = '';

  // Messaggio di errore mostrato nel template con *ngIf="errore".
  // Se è una stringa vuota ('') *ngIf la considera falsa e nasconde il messaggio.
  errore: string = '';

  // Dati dell'utente attualmente loggato, letti dalla sessione.
  // "Partial<Utente>" significa che non tutti i campi di Utente sono obbligatori —
  // potremmo avere solo username senza gli altri campi.
  // "| null" significa che può anche essere null (nessun utente loggato).
  loggedUser: Partial<Utente> | null = null;

  // Ruolo scelto dall'utente nella pagina SceltaRuolo, letto dal query param ?ruolo=...
  // Determina due comportamenti:
  //  1. Se è 'amministratore', il template nasconde il bottone "REGISTRATI" (*ngIf)
  //  2. Dopo il login, decide verso quale home navigare (navigaHome)
  ruolo: string = '';


  // Angular inietta automaticamente questi quattro servizi quando crea il componente.
  // "private" li rende accessibili con this.nomeServizio dentro tutta la classe,
  // ma non dall'esterno del componente.
  constructor(
    private session: SessionService,     // gestisce token e utente in sessione
    private router: Router,              // naviga tra le pagine
    private route: ActivatedRoute,       // legge i parametri dell'URL corrente
    private userService: UtenteService   // chiama il backend per login e ricerca utenti
  ) {}


  // ngOnInit è un lifecycle hook: Angular lo chiama automaticamente subito dopo
  // aver creato il componente e aver valorizzato le sue proprietà di input.
  // È il posto giusto per inizializzazioni che dipendono da servizi iniettati.
  ngOnInit(): void {

    // Recupera l'eventuale utente già loggato dalla sessione precedente.
    this.loggedUser = this.session.getLoggedUser();

    // Legge il query param "ruolo" dall'URL corrente.
    // snapshot è una fotografia istantanea della route al momento del caricamento.
    // queryParamMap è una mappa di tutti i query param presenti nell'URL.
    // get('ruolo') restituisce il valore del param "ruolo", oppure null se non esiste.
    // "?? ''" è l'operatore nullish coalescing: se il risultato è null o undefined, usa '' come default.
    this.ruolo = this.route.snapshot.queryParamMap.get('ruolo') ?? '';
  }


  // ─── Navigazione home per ruolo ───────────────────────────────────────────

  // Metodo privato: può essere chiamato solo dall'interno di questa classe.
  // Legge this.ruolo e naviga verso la home corrispondente.
  private navigaHome(): void {

    // homeMap è un oggetto che funge da dizionario ruolo → route.
    // Record<string, string> è un tipo TypeScript: un oggetto con chiavi string e valori string.
    const homeMap: Record<string, string> = {
      cliente:        '/home-cliente',
      dogsitter:      '/home-dogsitter',
      amministratore: '/home-amministratore',
    };

    // Cerca la route per il ruolo corrente.
    // Se il ruolo non è nella mappa (es. stringa vuota o valore inatteso),
    // il fallback ?? '/home-cliente' evita che l'app vada in crash.
    const dest = homeMap[this.ruolo] ?? '/home-cliente';

    // Naviga verso la home giusta.
    this.router.navigate([dest]);
  }


  // ─── Login ────────────────────────────────────────────────────────────────

  // Metodo chiamato dal template tramite (ngSubmit) quando l'utente invia il form.
  login(): void {

    // Resettiamo l'eventuale messaggio di errore di un tentativo precedente.
    this.errore = '';

    // Chiamata HTTP al backend tramite UtenteService.
    // login() restituisce un Observable: un flusso di dati asincrono.
    // subscribe() "si iscrive" al flusso e riceve il risultato quando arriva dal server.
    // L'oggetto passato a subscribe ha due callback:
    //   next  → eseguita se la chiamata va a buon fine
    //   error → eseguita se il server risponde con un errore (es. 401 Unauthorized)
    this.userService.login(this.username, this.password).subscribe({

      next: (res) => {
        // res è la risposta del backend. Verifichiamo che contenga un token valido.
        if (res && res.token) {

          // Salviamo il token JWT nella sessione (tipicamente in localStorage).
          // Verrà usato per autenticare le chiamate HTTP successive.
          this.session.setToken(res.token);

          // Salviamo i dati dell'utente loggato nella sessione.
          // Se il backend non restituisce un oggetto user completo, salviamo almeno lo username.
          this.session.setLoggedUser(res.user || { username: this.username });

          // Aggiorniamo la proprietà locale con i dati appena salvati.
          this.loggedUser = this.session.getLoggedUser() as Utente | null;

          // Naviga verso la home corretta per il ruolo scelto.
          this.navigaHome();

        } else {
          // Il server ha risposto 200 ma senza token: situazione anomala.
          this.errore = 'Risposta di autenticazione non valida';
        }
      },

      error: (err) => {
        // Il backend principale non è raggiungibile (es. sviluppo solo frontend).
        // Logghiamo l'errore in console per debug.
        console.error('Login via /auth/login fallito', err);

        // Fallback: proviamo il vecchio endpoint che cerca gli utenti per username.
        // Questo è un meccanismo di compatibilità per lo sviluppo locale senza backend completo.
        this.userService.getUserByUsername(this.username).subscribe({

          next: (users: Utente[]) => {
            // getUserByUsername restituisce un array: prendiamo il primo risultato.
            const user = users && users.length ? users[0] : null;

            // Confronto diretto della password (solo in sviluppo — in produzione
            // la password non dovrebbe mai arrivare in chiaro dal backend).
            if (user && user.password === this.password) {
              this.session.setLoggedUser(user);
              this.loggedUser = this.session.getLoggedUser() as Utente | null;
              this.navigaHome();
            } else {
              this.errore = 'Password errata o utente non trovato';
            }
          },

          error: () => {
            // Anche il fallback ha fallito: il server non è raggiungibile.
            this.errore = 'Login fallito: impossibile contattare il server';
          }
        });
      },
    });
  }


  // ─── Registrazione ────────────────────────────────────────────────────────

  // Chiamato dal bottone "REGISTRATI" nel template.
  // Il bottone è già nascosto per gli amministratori con *ngIf nel template,
  // ma aggiungiamo un controllo anche qui come seconda linea di difesa.
  vaiRegistrazione(): void {

    // Se non c'è un ruolo valido o è amministratore, non facciamo nulla.
    if (!this.ruolo || this.ruolo === 'amministratore') return;

    // Naviga verso la route di registrazione specifica per il ruolo.
    // router.navigate con array di segmenti produce:
    //   ['registrazione', 'cliente']   → /registrazione/cliente
    //   ['registrazione', 'dogsitter'] → /registrazione/dogsitter
    this.router.navigate(['/registrazione', this.ruolo]);
  }

}