import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer | undefined;
  private userId: string | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private injector: Injector
  ) {
    setTimeout(() => (this.http = injector.get(HttpClient)));
  }

  getToken(): string | undefined {
    return this.token;
  }

  getUserId(): string | undefined {
    return this.userId;
  }
  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(authData: AuthData): void {
    // Create authData object
    console.log(authData);

    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe({
        next: (response) => {
          console.log(response);

          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);

          if (this.authStatusListener) {
            this.authStatusListener.next(false);
          }
        },
      });
  }

  login(authData: AuthData): void {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe({
        next: (response) => this.handleAuthentication(response),
        error: (err) => {
          console.log(err);
          if (this.authStatusListener) {
            this.authStatusListener.next(false);
          }
        },
      });
  }

  handleAuthentication(response: {
    token: string;
    expiresIn: number;
    userId: string;
  }): void {
    const token = response.token;
    this.token = token;
    if (token) {
      const expiresInDuration = response.expiresIn;
      this.setLogoutTimer(expiresInDuration);
      this.userId = response.userId;
      this.isAuthenticated = !!this.token;
      this.authStatusListener.next(true);
      const expirationDate = new Date(
        new Date().getTime() + expiresInDuration * 1000
      );
      this.saveAuthData(token, expirationDate, this.userId);
      this.router.navigate(['/']);
    }
  }

  setLogoutTimer(expiresInDuration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn =
      authInformation.expirationDate.getTime() - now.getTime() / 1000;

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId!;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }
  setAuthTimer(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000);
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return { token, expirationDate: new Date(expirationDate), userId };
  }

  logout(): void {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer!);
    this.clearAuthData();
    this.userId = undefined;
    this.router.navigate(['/']);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string
  ): void {
    // Save token and expirationDate to local storage
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(): void {
    // Clear token and expirationDate from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
