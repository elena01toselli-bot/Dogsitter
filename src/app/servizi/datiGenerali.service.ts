
// Importiamo il decoratore @Injectable. Questo dice ad Angular che la classe può essere 
// "iniettata" come dipendenza in altri componenti o servizi attraverso il meccanismo della Dependency Injection
import { Injectable } from '@angular/core';

// Importiamo il client HTTP nativo di Angular. È lo strumento fondamentale che si occupa 
// di inviare richieste di rete (GET, POST, PUT, DELETE) verso un server/API backend esterna
import { HttpClient } from '@angular/common/http';

// Importiamo la classe Observable dalla libreria RxJS. Angular gestisce l'asincronia tramite la programmazione reattiva.
// Un Observable è un flusso di 
// dati asincrono a cui il componente dovrà "iscriversi" (.subscribe()) per ricevere i 
// dati non appena il database backend risponde
import { Observable } from 'rxjs';

@Injectable({
  // providedIn: 'root' Significa che il servizio diventa un Singleton: ne esisterà un'unica istanza in tutta 
  // l'applicazione, risparmiando memoria e permettendo (se necessario) di condividere dati identici tra componenti diversi
  providedIn: 'root'
})

// facciamo export cosi la possiamo importare in altri file, ad esempio in lista-cdc.ts
export class DatiGeneraliService {
  
  // private cosi nessuno al di fuori del servizio può accedere direttamente a questa variabile, 
  // è una buona pratica per incapsulare i dettagli di implementazione
  private apiUrl = 'http://localhost:8080/api/province';

  // Iniettiamo HttpClient nel costruttore del servizio. Angular si occuperà di fornire un'istanza di HttpClient
  constructor(private http: HttpClient) { }

  // Questo metodo restituisce un Observable che emette un array di stringhe 
  // (le province) quando la richiesta HTTP GET al backend ha successo
  getProvince(): Observable<string[]> {
    
    // l'uso dei generics <string[]>: stiamo applicando il Type Casting, dicendo a TypeScript: "Guarda che 
    // la risposta JSON che arriverà dal server deve essere mappata e considerata come un array di stringhe". 
    // Questo garantisce la massima sicurezza sul controllo dei tipi di dati prima ancora che l'app venga eseguita
    return this.http.get<string[]>(this.apiUrl);
  }
}