import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = environment.apiURL;
  constructor(private http: HttpClient) {}

  //user verification on login
  userLogin(inputData: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(this.apiURL + '/' + 'login', inputData);
  }

  userLoggedIn() {
    const userDoc = localStorage.getItem('user');
    if (userDoc) {
      const userObject = JSON.parse(userDoc);
      if (userObject.token && userObject.role === 'user') {
        return true;
      }
    }
    return false;
  }

  getToken() {
    const user = localStorage.getItem('user');
    const userObject = user ? JSON.parse(user) : null;
    const token = userObject?.token;
    return token;
  }

  adminLoggedIn() {
    const userDoc = localStorage.getItem('user');
    if (userDoc) {
      const userObject = JSON.parse(userDoc);
      if (userObject.token && userObject.role === 'admin') {
        return true;
      }
    }
    return false;
  }

  loggedIn() {
    const userDoc = localStorage.getItem('user');
    if (userDoc) {
      const userObject = JSON.parse(userDoc);
      if (userObject.token && userObject.role) {
        return false;
      }
    }
    return true;
  }
}
