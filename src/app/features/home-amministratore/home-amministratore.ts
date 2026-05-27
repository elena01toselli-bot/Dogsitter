
// @angular/core e @angular/router sono librerie installate nella cartella node_modules quando abbiamo creato il progetto Angular.



// necessario per dire ad angular che questa classe è un componente
import { Component } from '@angular/core';
// importa del servizio di router di angular per navigare tra le pagine
import { Router } from '@angular/router';


// Il decoratore @Component è una funzione speciale (il prefisso @ lo identifica) che aggiunge metadati a una classe. 
// È un pattern del linguaggio TypeScript, non inventato da Angular. @Component prende un oggetto di configurazione 
// e dice ad Angular: "questa classe non è una classe qualsiasi, è un componente Angular con queste caratteristiche"
@Component({

  // il selector è il nome del tag html con cui questo componente viene inserito in altri template
  // (template è un file HTML non statico che può contenere tag personalizzati, direttive e binding (come {{variabile}}) 
  // di Angular),dici ad angular che quando lo trova lo sostituisce con home-amministratore.html,
  // Il prefisso "app- è una convenzione per distinguere i tag custom Angular dai tag HTML nativi.
  selector: 'app-home-amministratore',
  
  // Se il tuo HTML usasse *ngIf dovresti importare CommonModule; 
  // se usasse <router-outlet> dovresti importare RouterOutlet
  // () => event binding,funziona senza importi perchè sono eventi nativi del browser
  imports: [],
  
  // Collegano il componente al suo file HTML e al suo file CSS.
  templateUrl: './home-amministratore.html',
  styleUrl: './home-amministratore.css',

})
// export è una parola chiave di TypeScript che rende questa classe disponibile per essere importata in altri file.
export class HomeAmministratore {

  // con la Dependency Injection(DI) Angular fornisce automaticamente un'istanza del Router ,quando viene
  // creata un'istanza di HomeAmministratore,ossia quando il browser deve mostrare il componente sullo schermo.
  // se esiste se no la crea e la inietta in questo componente, così possiamo usarla per navigare tra le pagine
  constructor(private router: Router) {}

  // la DI utile perchè Angular gestisce il ciclo di vita del servizio 
  // (crea una sola istanza globale del Router condivisa da tutti i componenti che ne hanno bisogno) 


  // mettere "private" davanti a router è una scorciatoia al posto di fare:
  // constructor(r: Router) {
  //   this.router = r;
  // }
  // in questo modo dichiariamo e inizializziamo la proprietà router in un solo passaggio

  // chiamato al click di una card da cui gli viene passato un parametro
  // Nota: () e [] gestiscono eventi e proprietà nativi del browser senza importare nulla.
  // Uso [(ngModel)] per il sincronismo a due vie, ma devo importare il 'FormsModule' 
  // nel componente: non per la sintassi delle parentesi, ma perché la direttiva (direttiva perchè dice ad angular cosa fare) 
  // 'ngModel' è uno strumento esterno dedicato alla gestione dei moduli.
   navigateTo(tipo: string): void {

    // this si riferisce all'istanza corrente della classe. navigate è il metodo del servizio Router di Angular; 
    // il primo argomento è un array di segmenti del path (Angular li unisce con /),
    // il secondo è un oggetto opzionale di opzioni. queryParams costruisce la query string: 
    // il risultato sarà un URL del tipo /home-amministratore/lista-cdc?tipo=campo
    this.router.navigate(['/home-amministratore/lista-cdc'], { queryParams: { tipo: tipo } });
  }

}