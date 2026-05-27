// L'entità base del servizio
export interface Servizio {
  ID?: number; // Opzionale perché quando ne crei uno nuovo non ha ancora l'ID
  categoria: string;
  durata: number;
}

// La tabella ponte che lega il dogsitter al servizio
export interface Offre {
  usernameDogsitter: string;     
  idServizio: number; // Modificato: meglio puntare all'ID del servizio piuttosto che alla categoria, così agganci anche la durata!
  prezzoListino: number;
}

// DTO (Data Transfer Object) - Questo è quello che ci fa comodo nel Frontend
// Rappresenta l'unione dei due modelli sopra, restituita dal Backend
export interface ServizioOfferto {
  idServizio?: number;
  usernameDogsitter: string;
  categoria: string;
  durata: number;
  prezzoListino?: number; // Ho aggiunto il prezzo visto che lo avevi nel tuo modello!
}