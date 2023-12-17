import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | undefined {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(authData: AuthData): void {
    // Create authData object

    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(
      (response) => {
        console.log(response);

        // Logic to handle successful API response
      },
      (error) => {
        console.log(error);

        // Logic to handle API error
      }
    );
  }

  login(authData: AuthData): void {
    // Create authData object

    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe({
        next: (response: { token: string; expiresIn: number }) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.tokenTimer = setTimeout(() => {
              this.logout();
            }, expiresInDuration * 1000);
            this.isAuthenticated = this.token ? true : false;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate);
            this.router.navigate(['/']);
          }
        },
        error(err) {
          console.log(err);
        },
      });
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
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn);
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
    if (!token || !expirationDate) {
      return;
    }
    return { token, expirationDate: new Date(expirationDate) };
  }

  logout(): void {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer!);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    // Save token and expirationDate to local storage
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(): void {
    // Clear token and expirationDate from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
