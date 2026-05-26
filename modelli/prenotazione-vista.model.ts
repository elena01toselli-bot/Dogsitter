export interface PrenotazioneVista {
  codiceId: number;
  nomeCane: string;
  nMicrochip: string;
  categoriaServizio: string; // 'Addestramento' (Campo) oppure 'Passeggiata', 'Toelettatura' (Dogsitter)
  dataSvolgimento: string;
  oraSvolgimento: string;
  prezzoPattuto: number;
  usernameCliente?: string;
  usernameDogsitter?: string;
}
