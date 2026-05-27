// OnInit è un'interfaccia,un contratto TypeScript che dice "questa classe deve avere un metodo chiamato ngOnInit()
// ngOnInit() è un metodo speciale che Angular chiama automaticamente quando il componente viene 
// creato e inserito nella pagina.
// Serve per inizializzare dati, fare chiamate al backend, leggere parametri dall'URL, ecc.
// importiamo Component per usare il decoratore @Component 
import { Component, OnInit } from '@angular/core';

// ActivatedRoute ti permette di leggere le informazioni della rotta attuale — in questo caso i query params (?tipo=campo).
// Router ti permette di navigare programmaticamente verso un'altra rotta (quando clicchi "Modifica" o "Torna")
import { ActivatedRoute, Router } from '@angular/router';

// CommonModule sblocca le direttive *ngIf e *ngFor nell'HTML
// FormsModule sblocca [(ngModel)] 
// senza questi due import Angular non riconoscerebbe quelle sintassi nel template (file HTML speciale perchè non è statico
// ma composto da questo tipo di elementi) e darebbe errore di compilazione
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// importiamo i modelli dei dati (struttre degli oggetti)
import { Cliente } from '../../../modelli/cliente.model';
import { Dogsitter } from '../../../modelli/dogsitter.model';
import { CampoAddestramento } from '../../../modelli/campo-addestramento.model';


// per invocarei i servizi che abbiamo creato per fare le chiamate HTTP al backend,
// dobbiamo importarli e iniettarli nel costruttore del componente

import { ClienteService } from '../../../servizi/cliente.service';
import { DogsitterService } from '../../../servizi/dogsitter.service';
import { CampoAddestramentoService } from '../../../servizi/campo-addestramento.service';
import { Utente } from '../../../modelli/utente.model';
import { DatiGeneraliService } from '../../../servizi/datiGenerali.service';


// Questo è un tipo unione TypeScript e dici che questa variabile può contenere 
// un oggetto di tipo Cliente o Dogsitter o CampoAddestramento.
type Entita = Cliente | Dogsitter | CampoAddestramento | Utente;


// tramite questo deoratore @Component definiamo che questa classe è un componente Angular 
// e gli aggiungiamo i metadati necessari per funzionare (selector, templateUrl, styleUrl, imports)
@Component({

  // selector è il nome del tag HTML con cui questo componente viene inserito in altri template
  selector: 'app-lista-cdc',

  // CommonModule sblocca le direttive *ngIf e *ngFor nell'HTML
  // FormsModule sblocca [(ngModel)] 
  // abilita queste funzionalità nel template di questo componente (lista-cdc.html)
  imports: [CommonModule, FormsModule],

  // Collegano il componente al suo file HTML e al suo file CSS.
  templateUrl: './lista-cdc.html',
  styleUrl: './lista-cdc.css',
})
// specifichiamo che questa classe implementa l'interfaccia OnInit, così TypeScript ci obbliga ad avere il metodo ngOnInit()
export class ListaCDC implements OnInit {

  // Tipo di entità ricevuto come query param dalla home amministratore
  // es. 'campo' | 'dogsitter' | 'utente'
  tipo: string = '';

  // Queste due proprietà sono collegate agli input dell'HTML tramite [(ngModel)] — two-way binding.
  // Quando l'utente scrive nell'input,
  // termineDiRicerca si aggiorna automaticamente. 
  // Quando il codice modifica termineDiRicerca, l'input si modifica a sua volta automaticamente
  // Testo digitato nella barra di ricerca per nome
  termineDiRicerca: string = '';
  // Valore selezionato per filtrare per provincia/zona
  provinciaFiltro: string = '';


  // Lista completa delle entità ricevuta dal backend (per ora dati finti)
  // non viene mai toccato dai filtri 
  tutteLeEntita: Entita[] = [];

  // Lista filtrata mostrata nella pagina dopo la ricerca
  // è la vista,ciò che l'utente vede
  entitaFiltrate: Entita[] = [];

  // Stato di caricamento — utile per mostrare un loader nell'HTML
  // mentre aspetti la risposta del backend
  caricamento: boolean = false;

  // Eventuale messaggio di errore da mostrare all'utente
  errore: string = '';


  // Lista delle province disponibili per il filtro (per ora fisse)
  // Viene usato nel template con *ngFor per generare le <option> della select dinamicamente 
  province: string[] = [];

  // si mette sempre private cosi non c'è bisogno di inizializzarla nel costruttore, 
  // Angular se ne occupa con la Dependency Injection
  // quindi d'ora in poi posso usare this.route e this.router in tutto il componente
  constructor(
    private route: ActivatedRoute,  // per leggere i query params dall'URL
    private router: Router,          // per navigare al profilo al click di "Incontra"

     // Inietti tutti e tre i servizi per fare richieste HTTP alle API del backend
    private clienteService: ClienteService,
    private dogsitterService: DogsitterService,
    private campoService: CampoAddestramentoService,
    private datiGeneraliService: DatiGeneraliService
  ) { }

  ngOnInit(): void {
    // Legge il parametro 'tipo' dall'URL (?tipo=campo oppure ?tipo=dogsitter ecc.)
    // this.route.queryParams è un Observable (un flusso di dati a cui ci possiamo iscrivere)
    // che emette un nuovo valore ogni volta che i query params cambiano.
    // ci mettiamo in ascolto con subscribe e ogni volta che riceviamo 
    // nuovi params si richiama la funzione dentro subscribe con i nuovi params.
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || '';
      this.caricaEntita();

      //carico le province dal database 
      this.caricaProvinceDalDatabase();
    });

    // ogni volta che cambio pagina l'istanza del componente viene distrutta e ricreata, 
    // quindi ngOnInit() viene chiamato di nuovo e rilegge i query params.
  }

  // Carica i dati in base al tipo selezionato
  caricaEntita(): void {

    // Resetta lo stato prima di ogni caricamento
    this.caricamento = true; // finche non riceviamo la risposta dal backend la pagina è in stato di caricamento
    this.errore = '';
    this.tutteLeEntita = [];
    this.entitaFiltrate = [];


    // con === confronto sia il valore sia il tipo
    if (this.tipo === 'campo') {

      // questo blocco di codice dimostra la natura asincrona di JavaScript e Angular

      // .subscribe() ha tre callback:
      // - next: dati arrivati con successo
      // - error: qualcosa è andato storto
      // this.campoService.getAll() fa partire la richiesta HTTP al backend, ma non blocca l'esecuzione del codice.
      // restituisce un Observable, Il metodo .subscribe() è l'atto con cui il componente 
      // si "iscrive" allo stream dell'Observable
      this.campoService.getAll().subscribe({

        // il parametro campi rappresenta il payload, ovvero i dati JSON inviati dal
        // backend che Angular ha già automaticamente convertito in un array di oggetti TypeScript.
        // viene fatta partire quando il server codice di stato HTTP 200 OK e manda i dati richiesti.
        next: (campi) => {
          this.tutteLeEntita = campi;
          this.entitaFiltrate = [...campi];
          this.caricamento = false;
        },
        // viene fatta partire quando il server risponde con un codice di errore (es. 500, 404, timeout, ecc.)
        error: (err) => {
          this.errore = 'Errore nel caricamento dei campi';
          this.caricamento = false;
          // Stampiamo l'errore tecnico originario nella console degli strumenti per sviluppatori (Developer Tools). 
          // Questo non è visibile all'utente finale
          console.error(err);
        }
      });

    } else if (this.tipo === 'dogsitter') {

      this.dogsitterService.getAll().subscribe({
        next: (dogsitter) => {
          this.tutteLeEntita = dogsitter;
          this.entitaFiltrate = [...dogsitter];
          this.caricamento = false;
        },
        error: (err) => {
          this.errore = 'Errore nel caricamento dei dogsitter';
          this.caricamento = false;
          console.error(err);
        }
      });

    } else if (this.tipo === 'cliente') {

      this.clienteService.getAll().subscribe({
        next: (clienti) => {
          this.tutteLeEntita = clienti;
          this.entitaFiltrate = [...clienti];
          this.caricamento = false;
        },
        error: (err) => {
          this.errore = 'Errore nel caricamento degli utenti';
          this.caricamento = false;
          console.error(err);
        }
      });
    }
  }

  // carico le province dal database per popolare la select del filtro per provincia
  caricaProvinceDalDatabase(): void {
    this.datiGeneraliService.getProvince().subscribe({
      next: (provinceDalBackend) => {
        // Quando il backend risponde, popola l'array
        this.province = provinceDalBackend;
      },
      error: (err) => {
        console.error('Errore durante il recupero delle province:', err);
      }
    });
  }

  elimina(entita: Entita): void {
    const nome = this.getNome(entita);
    const conferma = confirm(`Sei sicuro di voler eliminare "${nome}"?`);
    if (!conferma) return;

    if (this.tipo === 'campo') {
      const id = (entita as CampoAddestramento).nome;
      this.campoService.delete(id).subscribe({
        next: () => {
          // Rimuovi dalla lista locale solo dopo conferma del backend
          this.tutteLeEntita = this.tutteLeEntita.filter(e => e !== entita);
          this.entitaFiltrate = this.entitaFiltrate.filter(e => e !== entita);
        },
        error: (err) => {
          this.errore = 'Errore durante l\'eliminazione';
          console.error(err);
        }
      });

    } else if (this.tipo === 'dogsitter') {
      const id = (entita as Dogsitter).username;
      this.dogsitterService.delete(id).subscribe({
        next: () => {
          this.tutteLeEntita = this.tutteLeEntita.filter(e => e !== entita);
          this.entitaFiltrate = this.entitaFiltrate.filter(e => e !== entita);
        },
        error: (err) => {
          this.errore = 'Errore durante l\'eliminazione';
          console.error(err);
        }
      });

    } else if (this.tipo === 'cliente') {
      const id = (entita as Cliente).username;
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.tutteLeEntita = this.tutteLeEntita.filter(e => e !== entita);
          this.entitaFiltrate = this.entitaFiltrate.filter(e => e !== entita);
        },
        error: (err) => {
          this.errore = 'Errore durante l\'eliminazione';
          console.error(err);
        }
      });
    }
   }


  // get definisce una proprietà calcolata — sembra una proprietà ({{ titoloPagina }}), 
  // ma è in realtà una funzione che viene eseguita ogni volta che Angular la legge nell'HTML
  // Quindi quando carica la pagina
  get titoloPagina(): string {
    switch (this.tipo) {
      case 'campo': return 'Campi di Addestramento';
      case 'dogsitter': return 'Dog Sitter';
      case 'cliente': return 'Clienti';
      default: return 'Lista';
    }
  }

  // Restituisce l'icona emoji in base al tipo
  get iconaPagina(): string {
    switch (this.tipo) {
      case 'campo': return '🐕‍🦺';
      case 'dogsitter': return '🐾';
      case 'cliente': return '👤';
      default: return '📋';
    }
  }

  // Restituisce il nome visualizzato di ogni entità
  // (ogni tipo ha una proprietà diversa per il nome)
  getNome(entita: Entita): string {
    if (this.tipo === 'campo') {
      return (entita as CampoAddestramento).nome;
    } else {
      // Sia Cliente che Dogsitter hanno nome e cognome (ereditati da Utente)
      const u = entita as Cliente;

      // Le backtick ` con ${} sono i template literals 
      // un modo per costruire stringhe interpolando variabili senza concatenazione con +
      return `${u.nomeBattesimo} ${u.cognome}`;
    }
  }

  // Restituisce la provincia di ogni entità
  getProvincia(entita: Entita): string {

    return entita.provincia || '';
  }

  // Applica i filtri: nome + provincia
  filtra(): void {
    this.entitaFiltrate = this.tutteLeEntita.filter(entita => {

      //this si riferisce all'istanza del componente, quindi this.getNome() chiama la funzione getNome definita sopra,
      const nome = this.getNome(entita).toLowerCase();
      const provincia = this.getProvincia(entita).toLowerCase();

      // Verifica se il nome contiene il termine di ricerca 
      // tipo "milano centro" include "milano" → true
      const corrispondeNome = nome.includes(this.termineDiRicerca.toLowerCase());
      const corrispondeProvincia = this.provinciaFiltro === ''
        || provincia === this.provinciaFiltro.toLowerCase();

      return corrispondeNome && corrispondeProvincia;
    });
  }

  // Resetta tutti i filtri e mostra di nuovo tutto
  resetFiltri(): void {
    this.termineDiRicerca = '';
    this.provinciaFiltro = '';

    // con questa sintatti tiri fuori tutti gli elementi di tutteLeEntita 
    // e li metti in un nuovo array (così non modifichi l'array originale, è una copia)
    this.entitaFiltrate = [...this.tutteLeEntita];
  }

  // Naviga alla pagina di modifica dell'entità selezionata.
  // Passa 'tipo' e 'id' come query params (nell'URL) così la pagina di destinazione sa quale elemento caricare.
  modifica(entita: Entita): void {

    // Se l'entità è un campo di addestramento, lo mandiamo alla nuova rotta 'profilo-campo'
    if (this.tipo === 'campo') {
      
      this.router.navigate(['/home-amministratore/profilo-campo'], {
        queryParams: { name: (entita as CampoAddestramento).nome }
      });
    } else {

        if (this.tipo === 'dogsitter') {
          this.router.navigate(['/home-dogsitter/profilo'], {
            queryParams: {  username: (entita as Dogsitter).username }
          });
        }
        else if (this.tipo === 'cliente') {
          this.router.navigate(['/home-cliente/profilo'], {
            queryParams: {  username: (entita as Cliente).username }
          });
      }

    }
  }
  

  // Naviga alla pagina di aggiunta di una nuova entità
  // Passa 'tipo' come query param (nell'URL) così la pagina di destinazione sa quale form mostrare.
  // questa va indirizzata nella pagina di registrazione
  aggiungi(): void {

    if (this.tipo === 'campo') {
      this.router.navigate(['/registrazione-campo']);
    }
    else
    {      
      if (this.tipo === 'dogsitter') {
        this.router.navigate(['/registrazione-dogsitter']);
      }
      else if (this.tipo === 'cliente') {
        this.router.navigate(['/registrazione-cliente']);
      }
    }
  }

  // Torna alla home dell'amministratore
  torna(): void {
    this.router.navigate(['/home-amministratore']);
  }
}
