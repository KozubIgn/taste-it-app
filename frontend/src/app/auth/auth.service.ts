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
import { jwtDecode } from 'jwt-decode';

export interface AuthResponseData {
  token: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  id: string;
  registered?: boolean;
}

export interface LocalStoreUserData {
  id: string;
  email: string;
  _token: string;
  _tokenExpirationTime: number;
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
    return this.http.post<AuthResponseData>(
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
          const expirationDate = this.getExpirationTimefromToken(resData.token);
          this.handleAuthentication(resData.id, resData.email, resData.token, expirationDate!);
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
          this.handleAuthentication(resData.id, resData.email, resData.token, this.getExpirationTimefromToken(resData.token)!);
        })
      );
  }

  handleAutoLogin() {
    const localStoreUserData: LocalStoreUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!localStoreUserData) {
      return;
    }
    const loadedUser = this.loadUserFromLocalStorage(localStoreUserData);
    if (loadedUser) {
      this.user$.next(loadedUser);
      const remainingTime = this.getRemainingTime(localStoreUserData._tokenExpirationTime);
      this.setLogoutTimer(remainingTime);
    }
  }

  loadUserFromLocalStorage(userData: LocalStoreUserData): User | null {
    if (!userData || !userData._token) {
      return null;
    }
    const tokenExpirationTime = this.getExpirationTimefromToken(userData._token);
    return new User(userData.id, userData.email, userData._token, tokenExpirationTime);
  }

  private getExpirationTimefromToken(token: string): number | undefined {
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp;
    }
  }

  getRemainingTime(timeInMs: number) {
    return timeInMs ? timeInMs - Math.floor(Date.now() / 1000) : 0;
  }

  private handleAuthentication(localId: string, email: string, token: string, expiresIn: number) {
    const user = new User(localId, email, token, expiresIn);
    this.user$.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
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

  setLogoutTimer(expirationTime: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationTime);
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
