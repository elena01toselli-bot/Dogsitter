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

  // ruolo opzionale, utile per identificare se è cliente, dogsitter o admin
  // affidato dal backend o gestito in fase di login, ma non necessario per tutte le operazioni
  ruolo?: 'cliente' | 'dogsitter' | 'amministratore';
}