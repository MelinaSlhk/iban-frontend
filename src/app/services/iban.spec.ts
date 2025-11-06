import { TestBed } from '@angular/core/testing';
import { IbanService } from './iban';

describe('IbanService (mock)', () => {
  let service: IbanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns true for a known valid IBAN from the mock list', (done) => {
    service.checkIban('FR7630006000011234567890189').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('returns false for an unknown IBAN', (done) => {
    service.checkIban('FR0000000000000000000000000').subscribe(result => {
      expect(result).toBeFalse();
      done();
    });
  });
});
