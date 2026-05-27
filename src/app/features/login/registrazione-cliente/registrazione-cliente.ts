import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Utente } from '../../../modelli/utente.model';
import { UtenteService } from '../../../servizi/utente.service';

@Component({
  selector: 'app-registrazione-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrazione-cliente.html',
  styleUrls: ['./registrazione-cliente.css'],
})
export class RegistrazioneCliente {

  utente: Utente = {
    username: '', nomeBattesimo: '', cognome: '',
    cap: '', nCivico: '', provincia: '', via: '',
    nTel: '', password: '', ruolo: 'cliente',
  };

  confermaPassword = '';
  errore  = '';
  successo = '';

  constructor(private utenteService: UtenteService, private router: Router) {}

  // ── Requisiti password ────────────────────────────────
  get hasMinLength()  { return (this.utente.password?.length ?? 0) >= 8; }
  get hasUppercase()  { return /[A-Z]/.test(this.utente.password ?? ''); }
  get hasNumber()     { return /[0-9]/.test(this.utente.password ?? ''); }
  get hasSpecial()    { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.utente.password ?? ''); }
  get passwordValida(){ return this.hasMinLength && this.hasUppercase && this.hasNumber && this.hasSpecial; }

  register(form: NgForm): void {
    this.errore = '';
    this.successo = '';

    if (form.invalid) { this.errore = 'Compila tutti i campi obbligatori.'; return; }
    if (!this.passwordValida) { this.errore = 'La password non rispetta i requisiti richiesti.'; return; }
    if (this.confermaPassword !== this.utente.password) { this.errore = 'Le password non coincidono.'; return; }

    this.utenteService.create(this.utente).subscribe({
      next: () => { this.router.navigate(['/home-cliente']); },
      error: (err) => {
        if (err.status === 201 || err.status === 200) { this.router.navigate(['/home-cliente']); return; }
        this.errore = 'Si è verificato un errore durante la registrazione.';
      }
    });
  }
}