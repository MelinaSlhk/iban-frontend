import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IbanService {
  // Liste mockée d'IBAN valides
  private validIbans = [
    'FR7612345678901234567890124',
    'FR1423456789012345678901234',
    'FR7630006000011234567890189'
  ];

  constructor() { }

  // Méthode pour vérifier un IBAN (simule un appel API)
  checkIban(iban: string): Observable<boolean> {
    const isValid = this.validIbans.includes(iban);
    return of(isValid);
  }
}
