import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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

    this.http.post('http://localhost:3000/api/user/login', authData).subscribe(
      (response) => {
        console.log(response);

        // Logic to handle successful login
      },
      (error) => {
        console.log(error);

        // Logic to handle login error
      }
    );
  }
}

  

