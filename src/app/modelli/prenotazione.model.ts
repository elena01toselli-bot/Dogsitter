export interface Prenotazione {
  codiceId: number;
  nomeCane: string;
  nMicrochip: string;
  categoriaServizio: string; // 'lezione' (Campo) oppure 'dogsitter' (Dogsitter)
  dataSvolgimento: string;
  oraSvolgimento: string;
  prezzoPattuito: number;
  usernameCliente?: string;
  usernameDogsitter?: string;
}
