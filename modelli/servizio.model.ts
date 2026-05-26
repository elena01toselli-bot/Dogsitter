export interface Servizio {
  Id: number;
  categoria: string;
  durata: number; // durata in minuti
}
export interface Offre {
  usernameDogsitter: string;     // FK → DOG_SITTER
  catServizio: string;           // FK → SERVIZIO
  prezzoListino: number;
  durataMinuti?: number;         // JOIN con SERVIZIO.durata (opzionale per retrocompatibilità)
}