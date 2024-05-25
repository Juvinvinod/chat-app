import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const tokenizedReq = request.clone({
      setHeaders: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
    return next.handle(tokenizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.setError(error);
        this.snackBar.open(errorMessage, 'Dismiss', {
          duration: 5000,
        });
        return throwError(() => errorMessage);
      })
    );
  }

  setError(error: HttpErrorResponse): string {
    let errorMessage = 'Connection Error';
    if (error.error.message) {
      // If the error response has an 'errors' property, use it
      errorMessage = error.error.message;
    }
    return errorMessage;
  }
}
