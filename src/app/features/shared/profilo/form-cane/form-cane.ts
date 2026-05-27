import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cane } from '../../../../modelli/cane.model';


//importo il servizio per i cani (da creare) in modo da poter salvare le modifiche al cane o inserire un nuovo cane
import { CaneService } from '../../../../servizi/cane.service';

@Component({
  selector: 'app-form-cane',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-cane.html',
  styleUrl: './form-cane.css'
})
export class FormCane implements OnInit {
  
  inModifica: boolean = false;
  cane: Cane = { nMicrochip: '', nome: '', razza: '', taglia: 'Media', dataNascita: '', noteComportamento: '', usernameCliente: '' };

  constructor(private router: Router, private caneService: CaneService) {}

  ngOnInit(): void {
      const stato = history.state;

        if (stato?.cane) {
          // Modalità modifica: precompila il form con i dati esistenti
          this.cane = { ...stato.cane };
          this.inModifica = true;
        } else if (stato?.usernameProprietario) {
          // Nuovo cane: imposta subito il proprietario
          this.cane.usernameCliente = stato.usernameProprietario;
        }

  }
  
  salva(): void {
    if (!this.cane.nome || !this.cane.nMicrochip) {
      alert('I campi Nome e Microchip sono obbligatori!');
      return;
    }

    if (this.inModifica) {
      // Chiamata API PUT
      this.caneService.update(this.cane).subscribe({
        next: () => {
          alert('Modifiche salvate con successo!');
          this.router.navigate(['/home-cliente/profilo']); // Torna al profilo
        },
        error: (err) => console.error('Errore modifica:', err)
      });
    } else {
      
      this.caneService.create(this.cane).subscribe({
        next: () => {
          alert('Nuovo cane registrato!');
          this.router.navigate(['/home-cliente/profilo']); // Torna al profilo
        },
        error: (err) => console.error('Errore creazione:', err)
      });
    }
  }
 
 
  annulla(): void {
    this.router.navigate(['/home-cliente/profilo']);
  }
}