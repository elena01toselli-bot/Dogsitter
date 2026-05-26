export interface Prenotazione {
  codiceId: number;
  prezzoPattuto: number;
  tipologiaAttivita: 'lezione' | 'servizio';
  nMicrochip: string;            // FK → CANE
  nomeCampo?: string;            // FK → CAMPO (se lezione)
  oraLezione?: string;
  dataLezione?: string;
}

export interface EsecuzioneServizio {
  codiceIdPrenotazione: number;  // FK → PRENOTAZIONE
  catServizio: string;           // FK → SERVIZIO
  usernameDogsitter: string;     // FK → DOG_SITTER
  oraSvolgimento: string;
  dataSvolgimento: string;
}
