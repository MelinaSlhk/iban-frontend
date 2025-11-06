import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IbanVerificationComponent } from './iban-verification';
import { IbanService } from '../../services/iban';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WcsAngularModule } from 'wcs-angular';

describe('IbanVerificationComponent', () => {
  let fixture: ComponentFixture<IbanVerificationComponent>;
  let component: IbanVerificationComponent;
  let mockService: jasmine.SpyObj<IbanService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('IbanService', ['checkIban']);

    await TestBed.configureTestingModule({
      imports: [IbanVerificationComponent, WcsAngularModule],
      providers: [{ provide: IbanService, useValue: mockService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(IbanVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display success message after clicking verify when IBAN is valid', (done) => {
    mockService.checkIban.and.returnValue(of(true));
    component.iban = 'FR7630006000011234567890189';
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('wcs-button'));
    // trigger click on the custom element
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    // message is set asynchronously via subscription in validateIban
    setTimeout(() => {
      fixture.detectChanges();
      const msgEl = fixture.debugElement.query(By.css('.iban-message'));
      expect(component.error).toBeFalse();
      expect(msgEl).toBeTruthy();
      expect(msgEl.nativeElement.textContent).toContain('Votre IBAN est bien valide');
      done();
    }, 0);
  });

  it('should display error message after clicking verify when IBAN is invalid', (done) => {
    mockService.checkIban.and.returnValue(of(false));
    component.iban = 'FR0000000000000000000000000';
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('wcs-button'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    setTimeout(() => {
      fixture.detectChanges();
      const msgEl = fixture.debugElement.query(By.css('.iban-message'));
      expect(component.error).toBeTrue();
      expect(msgEl).toBeTruthy();
      expect(msgEl.nativeElement.textContent).toContain('IBAN non valide');
      done();
    }, 0);
  });
});
