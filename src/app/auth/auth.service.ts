import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | undefined;

  constructor(private http: HttpClient) {}

  getToken(): string | undefined {
    return this.token;
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
          // Logic to handle successful login
        },
        (error) => {
          console.log(error);

          // Logic to handle login error
        }
      );
  }
}
