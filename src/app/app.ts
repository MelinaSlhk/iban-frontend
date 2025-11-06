import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WcsAngularModule } from 'wcs-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WcsAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('iban-frontend');
}
