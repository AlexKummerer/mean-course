import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${
              error.error.message || error.error.error.message
            }`;
          } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${
              error.error.message || error.error.error.message
            }`;
          }
          this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
          const err = new Error(errorMessage);
          return throwError(() => err);
        })
      );
    } catch (error: any) {
      return throwError(() => error);
    }
  }
}
