import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Il decoratore @Component indica ad Angular che questa classe è un Componente.
// Definisce come questo componente si inserisce nella pagina HTML e quali file usa.
@Component({
  selector: 'app-root', // Questo è il "tag" HTML custom usato in index.html (<app-root>)
  imports: [RouterOutlet], // RouterOutlet permette di cambiare il contenuto della pagina dinamicamente
  templateUrl: './app.html', // Il file HTML associato a questo componente
  styleUrl: './app.css'      // Il file CSS associato a questo componente
})
export class App {
  // Questa è la classe TypeScript che gestisce la logica del componente radice.
  // signal è un modo moderno di Angular per gestire lo stato/variabili reattive.
  protected readonly title = signal('Dog-sitter_FE');
}
