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

  constructor(private http: HttpClient, private router :Router) {}

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
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          this.isAuthenticated = this.token ? true : false;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
          // Logic to handle successful login
        },
        (error) => {
          console.log(error);

          // Logic to handle login error
        }
      );
  }

  logout(): void {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
