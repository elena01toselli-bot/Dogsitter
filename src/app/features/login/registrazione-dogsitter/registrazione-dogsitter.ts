import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Utente } from '../../../modelli/utente.model';
import { UtenteService } from '../../../servizi/utente.service';

@Component({
  selector: 'app-registrazione-dogsitter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrazione-dogsitter.html',
  styleUrls: ['./registrazione-dogsitter.css'],
})
export class RegistrazioneDogsitter {

  utente: Utente = {
    username: '', nomeBattesimo: '', cognome: '',
    cap: '', nCivico: '', provincia: '', via: '',
    nTel: '', password: '', ruolo: 'dogsitter',
  };

  confermaPassword = '';
  errore  = '';
  successo = '';

  giorni: string[] = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'];
  taglie: string[] = ['PICCOLA', 'MEDIA', 'GRANDE'];
  giorniSelezionati: string[] = [];
  taglieSelezionate: string[] = [];

  constructor(private utenteService: UtenteService, private router: Router) {}

  // ── Requisiti password ────────────────────────────────
  get hasMinLength()  { return (this.utente.password?.length ?? 0) >= 8; }
  get hasUppercase()  { return /[A-Z]/.test(this.utente.password ?? ''); }
  get hasNumber()     { return /[0-9]/.test(this.utente.password ?? ''); }
  get hasSpecial()    { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.utente.password ?? ''); }
  get passwordValida(){ return this.hasMinLength && this.hasUppercase && this.hasNumber && this.hasSpecial; }

  toggleGiorno(giorno: string): void {
    const idx = this.giorniSelezionati.indexOf(giorno);
    idx > -1 ? this.giorniSelezionati.splice(idx, 1) : this.giorniSelezionati.push(giorno);
  }

  toggleTaglia(taglia: string): void {
    const idx = this.taglieSelezionate.indexOf(taglia);
    idx > -1 ? this.taglieSelezionate.splice(idx, 1) : this.taglieSelezionate.push(taglia);
  }

  register(form: NgForm): void {
    this.errore = '';
    this.successo = '';

    if (form.invalid) { this.errore = 'Compila tutti i campi obbligatori.'; return; }
    if (!this.passwordValida) { this.errore = 'La password non rispetta i requisiti richiesti.'; return; }
    if (this.confermaPassword !== this.utente.password) { this.errore = 'Le password non coincidono.'; return; }
    if (this.giorniSelezionati.length === 0) { this.errore = 'Seleziona almeno un giorno di lavoro.'; return; }
    if (this.taglieSelezionate.length === 0) { this.errore = 'Seleziona almeno una taglia accettata.'; return; }

    const payload: any = {
      ...this.utente,
      ruolo:         'dogsitter',
      disponibilita: this.giorniSelezionati,
      taglie:        this.taglieSelezionate,
    };

    this.utenteService.create(payload).subscribe({
      next: () => { this.router.navigate(['/home-dogsitter']); },
      error: (err) => {
        if (err.status === 201 || err.status === 200) { this.router.navigate(['/home-dogsitter']); return; }
        this.errore = 'Si è verificato un errore durante la registrazione.';
      }
    });
  }
}