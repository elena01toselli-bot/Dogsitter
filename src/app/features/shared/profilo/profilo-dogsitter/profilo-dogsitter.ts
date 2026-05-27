import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServizioService } from '../../../../servizi/servizio.service'; // Assicurati che il path sia corretto
import { ServizioOfferto } from '../../../../modelli/servizio.model'; // Naviga fino al tuo modello integrato
import { Recensione } from '../../../../modelli/recensione.model';
import { Dogsitter } from '../../../../modelli/dogsitter.model'; 
import { RecensioneService } from '../../../../servizi/recensione.service';

@Component({
  selector: 'app-profilo-dogsitter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profilo-dogsitter.html',
  styleUrl: './profilo-dogsitter.css'
})
export class ProfiloDogsitter implements OnInit {
  
  @Input() dogsitter!: Dogsitter;

  serviziOfferti: ServizioOfferto[] = []; // Allineato al nuovo DTO del tuo modello
  recensioni: Recensione[] = [];

  constructor(private router: Router, private servizioService: ServizioService, private recensioneService: RecensioneService) {}

  ngOnInit(): void {
    if (this.dogsitter) {
      this.caricaServizi();
      this.caricaRecensioni();
    }
  }

  caricaServizi(): void {
    this.servizioService.getServiziBySitter(this.dogsitter.username).subscribe({
      next: (serviziBackend) => {
        this.serviziOfferti = serviziBackend;
      },
      error: (err) => console.error('Errore nel recupero dei servizi', err)
    });
  }

  caricaRecensioni(): void {
    this.recensioneService.getRecensioniByDogsitter(this.dogsitter.username).subscribe({
      next: (recensioniBackend) => {
        this.recensioni = recensioniBackend;
      },
      error: (err) => console.error('Errore nel recupero delle recensioni', err)
    });
  }

  // Naviga verso il form passando il servizio completo in caso di modifica
  vaiAFormServizio(servizio?: ServizioOfferto): void {
    this.router.navigate(['/home-dogsitter/form-servizio'], { 
      state: { 
        sitterUsername: this.dogsitter.username,
        servizioDaModificare: servizio // Passa tutto l'oggetto servizio, così hai già categoria, durata e prezzo 
      } 
    });
  }

  rimuoviServizio(servizio: ServizioOfferto): void {
    if (!servizio.idServizio) return; // Allineato a idServizio del nuovo modello
    
    if (confirm(`Vuoi disattivare il servizio "${servizio.categoria}" da ${servizio.durata} min?`)) {
      this.servizioService.rimuoviServizio(servizio.idServizio).subscribe({
        next: () => {
          this.serviziOfferti = this.serviziOfferti.filter(s => s.idServizio !== servizio.idServizio);
          console.log(`Servizio ${servizio.idServizio} rimosso.`);
        },
        error: (err) => alert('Errore nella rimozione del servizio')
      });
    }
  }
}