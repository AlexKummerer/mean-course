import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { AuthData } from './auth-data.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a user', () => {
    const dummyAuthData: AuthData = {
      email: 'test@test.com',
      password: '123456',
    };

    service.createUser(dummyAuthData).subscribe((res) => {
      expect(res).toEqual(dummyAuthData);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/user/signup');
    expect(req.request.method).toBe('POST');
    req.flush(dummyAuthData);
  });

  it('should login and retrieve auth data', () => {
    const dummyAuthData: AuthData = {
      email: 'test@test.com',
      password: '123456',
    };
    const dummyResponse = { token: 'abc', expiresIn: 3600, userId: '1' };

    service.login(dummyAuthData).subscribe((res) => {
      expect(service.getIsAuth()).toBeTrue();
      expect(service.getToken()).toEqual(dummyResponse.token);
      expect(service.getUserId()).toEqual(dummyResponse.userId);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/user/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should logout and clear auth data', () => {
    service.logout();

    expect(service.getIsAuth()).toBeFalse();
    expect(service.getToken()).toBeUndefined();
    expect(service.getUserId()).toBeUndefined();
  });
  // Add more tests for other methods
});
