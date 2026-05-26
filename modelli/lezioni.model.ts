export interface Lezione {
  nomeCampo: string;             // FK → CAMPO_ADDESTRAMENTO
  ora: string;
  data: string;
  tipologia: string;
  costo: number;
  maxPartecipanti: number;
}
