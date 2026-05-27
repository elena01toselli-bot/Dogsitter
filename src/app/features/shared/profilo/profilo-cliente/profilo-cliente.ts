import { Component, OnInit, Input } from '@angular/core'; //importiamo Input per ricevere dati dal componente padre
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cane } from '../../../../modelli/cane.model';

import { Cliente } from '../../../../modelli/cliente.model'; // Importiamo il modello Cliente

// importiamo il servizio per i cani (da creare) in modo da poter recuperare i cani associati al cliente
import { CaneService } from '../../../../servizi/cane.service';

@Component({
  selector: 'app-profilo-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profilo-cliente.html',
  styleUrl: './profilo-cliente.css'
})
export class ProfiloCliente implements OnInit {

  // Riceve i dati del cliente direttamente dal componente padre
  @Input() cliente!: Cliente;

  caniUtente: Cane[] = [];

  caricamento = false;
  errore: string | null = null;

  constructor(
    private router: Router,
    private caneService: CaneService
  ) { }


  ngOnInit(): void {

    if (this.cliente) {
      this.caricaCani();
    }

  }

  private caricaCani(): void {

    this.caricamento = true;
    this.errore = null;

    // GET /api/cani/cliente/{username}
    this.caneService.getByCliente(this.cliente.username).subscribe({
      next: (cani) => {
        this.caniUtente = cani;
        this.caricamento = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei cani:', err);
        this.errore = 'Impossibile caricare i cani. Riprova più tardi.';
        this.caricamento = false;
      }
    });
  }

  vaiAFormCane(caneDaModificare?: Cane): void {
    if (caneDaModificare) {
      
      // MODIFICA CANE: passiamo l'intero oggetto cane da modificare allo stato della navigazione
      this.router.navigate(['/home-cliente/form-cane'], { state: { cane: caneDaModificare } });
    } else {

      // NUOVO CANE: passiamo solo l'username del padrone per sapere a chi associarlo!
      this.router.navigate(['/home-cliente/form-cane'], { state: { usernameProprietario: this.cliente.username } });
    }
  }

  eliminaCane(nMicrochip: string): void {
    if (!confirm('Sei sicuro di voler rimuovere questo cane dalla tua lista anagrafica?')) return;

    // DELETE /api/cani/{nMicrochip}
    this.caneService.delete(nMicrochip).subscribe({
      next: () => {
        // Aggiorna la lista locale solo dopo la conferma del backend
        this.caniUtente = this.caniUtente.filter(c => c.nMicrochip !== nMicrochip);
        console.log(`Cane con microchip ${nMicrochip} eliminato.`);
      },
      error: (err) => {
        console.error('Errore nell\'eliminazione del cane:', err);
        alert('Errore durante l\'eliminazione. Riprova più tardi.');
      }
    });
  }


  
}