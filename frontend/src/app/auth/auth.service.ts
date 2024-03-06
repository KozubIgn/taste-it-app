import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Auth,
  GoogleAuthProvider, signInWithPopup
} from '@angular/fire/auth';
import { Injectable, inject } from '@angular/core';
import {
} from 'firebase/auth'
import {
  BehaviorSubject,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { USER_LOGIN, USER_SIGN_UP } from '../shared/constants/urls';

export interface AuthResponseData {
  token: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  id: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private http: HttpClient = inject(HttpClient)
  private router: Router = inject(Router)
  user$ = new BehaviorSubject<User | null>(null);
  tokenExpirationTimer: any;

  GoogleAuth() {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        this.handleAuthentication(user.uid, user.email!, token!, 3600)
      })
  }
  logoutPopout() {
    this.auth.signOut();
  }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        USER_SIGN_UP,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.id,
            resData.email,
            resData.token,
            +resData.expiresIn
          );
        })
      );
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      USER_LOGIN,
      {
        email: email,
        password: password,
      }
    )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.id,
            resData.email,
            resData.token,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const localStoreUserData: {
      id: string;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!localStoreUserData) {
      return;
    }
    const loadedUser = new User(
      localStoreUserData.id,
      localStoreUserData.email,
      localStoreUserData._token,
      new Date(localStoreUserData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user$.next(loadedUser);
      const expirationDuration =
        new Date(localStoreUserData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logOut() {
    this.user$.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  private handleAuthentication(localId: string, email: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(localId, email, token, expirationDate);
    this.user$.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'this email already exist!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'this email does not exist!';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'email or password is not correct!';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }
}
