import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./components/iban-verification/iban-verification').then(m => m.IbanVerificationComponent)
	}
];
