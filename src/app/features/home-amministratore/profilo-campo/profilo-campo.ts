import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importiamo i modelli per avere i tipi corretti
import { CampoAddestramento } from '../../../modelli/campo-addestramento.model';
import { Lezione } from '../../../modelli/lezioni.model';


// Importiamo il servizio per poter fare le chiamate al backend
import { CampoAddestramentoService } from '../../../servizi/campo-addestramento.service';
import { LezioneService } from '../../../servizi/lezione.service';




@Component({
  selector: 'app-profilo-campo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profilo-campo.html',
  styleUrl: './profilo-campo.css',
})
export class ProfiloCampo implements OnInit {
  
  // Dati del campo attualmente visualizzato
  campo: CampoAddestramento | null = null;
  
  // Lista di lezioni associate al campo
  lezioniDelCampo: Lezione[] = [];

  // Variabile per capire se l'utente sta modificando una lezione
  // Se non è null, mostriamo il form di modifica
  lezioneInModifica: Lezione | null = null;

  // Aggiungiamo la variabile per salvare l'indice. 
  // La inizializziamo a -1 che in programmazione significa "nessun elemento selezionato" 
  // (poiché gli array partono da 0).
  // perchè lezione non ha id univoco
  indiceLezioneInModifica: number = -1;

  // Gestisce solo il caricamento della tabella lezioni
  caricamentoLezioni: boolean = true;

  constructor(
    private route: ActivatedRoute, // Serve per leggere i parametri passati nell'URL (?id=...)
    private router: Router,         // Serve per navigare tra le pagine (es. tornare indietro)
    private campoService: CampoAddestramentoService,
    private lezioneService: LezioneService
  ) {}

  // Questo metodo viene eseguito automaticamente da Angular all'avvio del componente
  ngOnInit(): void {
    // Ci mettiamo "in ascolto" dei parametri dell'URL
    this.route.queryParams.subscribe(params => {
      const idCampo = params['id'];
      if (idCampo) {
        this.caricaDatiCampo(idCampo);
      }
    });
  }

  // Simula il caricamento dei dati dal backend (per ora usiamo gli array finti)
  private caricaDatiCampo(nomeCampo: string): void {

    this.caricamentoLezioni = true; // Resettiamo il flag prima di ogni nuova ricerca

    // facciamo due chiamate separate alle API del backend:L'anagrafica del campo 
    // e l'elenco delle lezioni sono due risorse distinte sul database. Facendo due richieste HTTP 
    // asincrone distinte non blocchiamo l'interfaccia utente: se il server dovesse metterci più tempo a 
    // calcolare l'elenco delle lezioni, l'utente vedrebbe comunque immediatamente i dati principali del 
    // campo in cima alla pagina
    
    // Ci iscriviamo all'Observable restituito dal metodo getByNome
    this.campoService.getByNome(nomeCampo).subscribe({
      next: (campoDalBackend) => {
        // Quando il server risponde, salviamo il campo nella variabile
        this.campo = campoDalBackend;
        
      },
      error: (err) => {
        console.error('Errore durante il recupero del campo:', err);
        alert('Impossibile caricare i dati del campo di addestramento.');
        this.tornaIndietro(); // Se c'è un errore, lo rimandiamo alla lista
      }
    });

    // Ora facciamo la stessa cosa per le lezioni, usando il LezioneService
    this.lezioneService.getByCampo(nomeCampo).subscribe({
      next: (lezioniDalBackend) => {
        this.lezioniDelCampo = lezioniDalBackend;
        this.caricamentoLezioni = false; // Abbiamo finito di caricare le lezioni, possiamo mostrare la tabella

      },
      error: (err) => {
        console.error('Errore durante il recupero delle lezioni:', err);
        alert('Impossibile caricare le lezioni associate al campo di addestramento.');
          this.caricamentoLezioni = false; // Anche se c'è un errore,
          //  togliamo il caricamento per evitare di mostrare la scritta "Caricamento lezioni..." all'infinito
      }
    });
  
  }

  // --- METODI PER GESTIRE LE LEZIONI ---

  // Viene chiamato quando si clicca sul tasto "Modifica" di una lezione nella tabella
  modificaLezione(lezione: Lezione,index: number): void {
    // Facciamo una copia dell'oggetto (usando l'operatore spread "...") 
    // così se annulliamo le modifiche non sporchiamo il dato originale nella tabella
    this.lezioneInModifica = { ...lezione };

    // Salviamo l'indice in modo da sapere esattamente quale riga sovrascrivere dopo
    this.indiceLezioneInModifica = index;
  }

  // Annulla la modifica chiudendo il form senza salvare
  annullaModifica(): void {
    this.lezioneInModifica = null;
    this.indiceLezioneInModifica = -1; // Resettiamo anche l'indice
  }

  // Salva le modifiche (simulando una chiamata API al backend)
  salvaLezione(): void {
    if (this.lezioneInModifica) {
      
      // Inviamo la richiesta di UPDATE asincrona al backend
      this.lezioneService.update(this.lezioneInModifica).subscribe({
        next: (lezioneAggiornata) => {
          
          // OTTIMIZZAZIONE FRONTEND: Usiamo l'indice salvato!
          // Se è diverso da -1, significa che avevamo selezionato validamente una riga
          if (this.indiceLezioneInModifica !== -1) {
            
            // Sovrascriviamo la vecchia lezione all'indice esatto con i dati confermati dal backend
            this.lezioniDelCampo[this.indiceLezioneInModifica] = { ...lezioneAggiornata };
            
            // Resettiamo le variabili di stato per far scomparire il form
            this.indiceLezioneInModifica = -1;
          }

          alert('Lezione salvata con successo!');
          this.lezioneInModifica = null;  // chiude il form di modifica
        },
        error: (err) => {
          console.error('Errore durante il salvataggio della lezione:', err);
          alert('Impossibile aggiornare la lezione sul server.');
        }
      });
    }
  }

  // Torna alla lista
  tornaIndietro(): void {
    this.router.navigate(['/home-amministratore/lista-cdc'], { queryParams: { tipo: 'campo' } });
  }
}