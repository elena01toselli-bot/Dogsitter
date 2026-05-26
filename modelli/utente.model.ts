export interface Utente {
  username: string;
  nomeBattesimo: string;
  cognome: string;
  cap: string;
  nCivico: string;
  provincia: string;
  via: string;
  nTel: string;
  password: string;
  // Ruolo opzionale: sarà assegnato dal backend 
  ruolo?: string;
}