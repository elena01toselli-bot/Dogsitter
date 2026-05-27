import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// Importiamo i componenti dei profili specifici per i tag <app-profilo-cliente> e <app-profilo-dogsitter>
import { ProfiloCliente } from './profilo-cliente/profilo-cliente';
import { ProfiloDogsitter } from './profilo-dogsitter/profilo-dogsitter';

// Importiamo i servizi 
import { ClienteService } from '../../../servizi/cliente.service';
import { DogsitterService } from '../../../servizi/dogsitter.service';

// importiamo i modelli per i dati specifici di Cliente e Dogsitter
import { Cliente } from '../../../modelli/cliente.model';
import { Dogsitter } from '../../../modelli/dogsitter.model';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfiloCliente, ProfiloDogsitter],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css',
})
export class Profilo implements OnInit {

  ruolo: 'dogsitter' | 'cliente' = 'cliente';
  utente: Cliente | Dogsitter | null = null; // Può essere un Cliente o un Dogsitter completo
  username: string = '';

  // Iniettiamo i servizi nel costruttore tramite Dependency Injection
  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private dogsitterService: DogsitterService
  ) {}

  ngOnInit(): void {
    
    // 1. Intercettiamo il ruolo dai dati della rotta
    this.route.data.subscribe(data => {

      // data è un parametro definito in app.routes.ts quando abbiamo configurato la rotta per il Profilo.
      this.ruolo = data['ruolo'] || 'cliente';
      
      // 2. Intercettiamo l'username reale dai queryParams (?username=...) passati dall'URL
      this.route.queryParams.subscribe(params => {
        this.username = params['username'] || '';
        
        // 3. Avviamo il recupero asincrono dal backend solo se l'username è presente
        if (this.username) {
          this.caricaDatiSito();
        } else {
          console.error("Errore: Username non fornito come parametro 'username' nell'URL.");
          // Qui potresti voler mostrare un messaggio di errore all'utente o reindirizzarlo
        }
      });
    });

  }
private caricaDatiSito(): void {
    if (this.ruolo === 'dogsitter') {
      // Chiamata HTTP GET al backend dei dog sitter
      this.dogsitterService.getByUser(this.username).subscribe({
        next: (datiSitter) => {
          this.utente = datiSitter;
        },
        error: (err) => {
          console.error('Errore nel recupero del profilo dog sitter dal backend:', err);
        }
      });
    } else {
      // Chiamata HTTP GET al backend dei clienti
      this.clienteService.getById(this.username).subscribe({
        next: (datiCliente) => {
          this.utente = datiCliente;
        },
        error: (err) => {
          console.error('Errore nel recupero del profilo cliente dal backend:', err);
        }
      });
    }
  }


salvaAnagrafica(): void {
  
  if (!this.utente) return;

      if (this.ruolo === 'dogsitter') {
        // Chiamata HTTP PUT per aggiornare il dog sitter
        this.dogsitterService.update(this.utente as Dogsitter).subscribe({
          next: (risultato) => {
            this.utente = risultato;
            alert('Profilo Dog Sitter aggiornato con successo nel backend!');
          },
          error: (err) => {
            console.error('Errore durante il salvataggio del dog sitter:', err);
            alert('Impossibile salvare i dati del Dog Sitter.');
          }
        });
      } else {
        // Chiamata HTTP PUT per aggiornare il cliente
        this.clienteService.update(this.utente as Cliente).subscribe({
          next: (risultato) => {
            this.utente = risultato;
            alert('Profilo Cliente aggiornato con successo nel backend!');
          },
          error: (err) => {
            console.error('Errore durante il salvataggio del cliente:', err);
            alert('Impossibile salvare i dati del Cliente.');
          }
        });
      }
  }

  // Getter per accedere ai dati specifici di Cliente o Dogsitter in modo più pulito nei template
  // perchè se no utente sarebbe potuto essere sia Cliente che Dogsitter e non si sa mai quali 
  // proprietà sono disponibili senza fare cast ogni volta
  get utenteCliente(): Cliente {
  return this.utente as Cliente;
  }

  get utenteDogsitter(): Dogsitter {
    return this.utente as Dogsitter;
  }


}

