import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbanService } from '../../services/iban';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WcsAngularModule } from 'wcs-angular';

@Component({
  selector: 'app-iban-verification',
  standalone: true,
  imports: [CommonModule, WcsAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './iban-verification.html',
  styleUrls: ['./iban-verification.scss']
})
export class IbanVerificationComponent {

  iban: string = '';
  message: string = '';
  error: boolean = false;
  maxLength: number = 27; // longueur max IBAN FR

  private ibanInput = new Subject<string>();

  constructor(private ibanService: IbanService) {
    // Vérification en temps réel silencieuse (ne montre pas de message), pour n'afficher
    // les messages qu'après un clic sur "Vérifier"
    this.ibanInput.pipe(debounceTime(300)).subscribe(value => {
      this.silentValidateIban(value);
    });
  }

  // Déclenché à chaque saisie
  onIbanChange(event: any) {
    // wcs-input peut émettre un événement personnalisé : essaye plusieurs champs possibles
    const value = (event && (event.target?.value ?? event.detail?.value)) ?? event;
    this.iban = typeof value === 'string' ? value : String(value ?? '');
    // Efface tout message précédent à la saisie pour ne montrer les messages
    // (succès/erreur) qu'après validation explicite
    this.message = '';
    this.ibanInput.next(this.iban);
  }

  // Validation silencieuse utilisée pendant la saisie : met à jour l'état d'erreur
  // sans définir de message visible. Les messages seront définis par validateIban()
  private silentValidateIban(value: string) {
    if (!value) {
      this.error = false;
      return;
    }

    if (value.length > this.maxLength) {
      // Indique seulement l'état d'erreur, sans message texte
      this.error = true;
      return;
    }

    // Si la longueur est inférieure, on ne considère pas cela comme une erreur visible
    this.error = false;
  }

  // Validation de l'IBAN
  private validateIban(value: string) {
    // Normalisation
    const iban = (value ?? '').trim().toUpperCase();

    if (iban.length > this.maxLength) {
      this.message = `L'IBAN ne peut pas dépasser ${this.maxLength} caractères.`;
      this.error = true;
      return;
    }

    if (iban.length < this.maxLength) {
      const missing = this.maxLength - iban.length;
      // Si les deux premières lettres semblent manquer (entrée commencée par des chiffres)
      if (missing >= 2 && /^\d/.test(iban)) {
        this.message = `Il manque le code pays (2 lettres) au début de l'IBAN.`;
      } else {
        this.message = `L'IBAN est trop court (il manque ${missing} caractère${missing > 1 ? 's' : ''}).`;
      }
      this.error = true;
      return;
    }

    // Longueur correcte : contrôles plus précis
    // 1) Les deux premiers caractères doivent être des lettres (code pays)
    if (!/^[A-Z]{2}/.test(iban)) {
      this.message = `Les deux premiers caractères doivent être des lettres (code pays, ex. FR).`;
      this.error = true;
      return;
    }

    // 2) Vérifier qu'il y a des chiffres après le code pays (simple contrôle : pas de lettres)
    const rest = iban.slice(2);
    if (/[^0-9]/.test(rest)) {
      this.message = `L'IBAN doit contenir des chiffres après le code pays : il manque ou il y a des caractères invalides.`;
      this.error = true;
      return;
    }

    // Appel au service (mock API)
    this.ibanService.checkIban(iban).subscribe(isValid => {
      if (isValid) {
        this.message = '✅ Votre IBAN est bien valide !';
        this.error = false;
      } else {
        this.message = '❌ IBAN non valide.';
        this.error = true;
      }
    });
  }

  // Validation sur clic du bouton
  verifyIban() {
    this.validateIban(this.iban);
  }
}
