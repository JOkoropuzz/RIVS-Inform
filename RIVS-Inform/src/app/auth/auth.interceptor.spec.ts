import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: spy }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', () => {
    const token = 'fake-jwt-token';
    authServiceSpy.getToken.and.returnValue(token);

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (req) => {
        expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
        return null as any; // заглушка
      }
    };

    interceptor.intercept(request, next);
  });

  it('should not add Authorization header if token does not exist', () => {
    authServiceSpy.getToken.and.returnValue(null);

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (req) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return null as any; // заглушка
      }
    };

    interceptor.intercept(request, next);
  });
});
