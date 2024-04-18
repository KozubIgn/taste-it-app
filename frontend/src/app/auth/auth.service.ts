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
  map,
  tap,
  throwError,
} from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { REFRESH_TOKEN, REVOKE_TOKEN, USER_LOGIN, USER_SIGN_UP } from '../shared/constants/urls';
import { LocalStorageService } from './local-storage.service';

export interface AuthResponseData {
  jwtToken: string;
  refreshToken: string;
  user: User;
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
  private http: HttpClient = inject(HttpClient)
  private router: Router = inject(Router)
  private localStorageService: LocalStorageService = inject(LocalStorageService)
  public userSub$ = new BehaviorSubject<User | null>(null);
  private refreshTokenTimeout?: NodeJS.Timeout;
  private autoLoginTimeout: any;

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
    return this.http.post<AuthResponseData>(USER_SIGN_UP, { email: email, password: password, returnSecureToken: true })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.user,
            resData.jwtToken,
            resData.refreshToken,
          );
          this.startRefreshTokenTimer();
        })
      );
  }

  logIn(email: string, password: string) {
    return this.http.post<any>(USER_LOGIN, { email: email, password: password }, { withCredentials: true })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.user,
            resData.jwtToken,
            resData.refreshToken,
          );
          this.startRefreshTokenTimer();
        })
      );
  }

  logOut() {
    if (this.userSub$) {
      this.http.post<any>(REVOKE_TOKEN, {}, { withCredentials: true }).subscribe()
      this.stopRefreshTokenTimer();
      this.userSub$.next(null);
      this.localStorageService.clearAll();
      this.router.navigate(['/auth']);
    }
  }

  refreshToken() {
    return this.http.post<any>(REFRESH_TOKEN, {}, { withCredentials: true })
      .pipe(map((response) => {
        this.userSub$.next(response.user);
        this.startRefreshTokenTimer();
        this.localStorageService.updateUserToken(response.user.token);
        this.localStorageService.setToken(response.jwtToken);
        this.localStorageService.setRefreshToken(response.refreshToken);
        return response.user;
      }),
      )
  }

  private startRefreshTokenTimer() {
    const jwtTokenformlocalstore = this.localStorageService.getRefreshToken();
    const expirationDate = this.getExpirationTimeFromToken(jwtTokenformlocalstore)
    const timeout = (expirationDate.getTime() - Date.now()) / 1000 - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private handleAuthentication(user: User, jwtToken: string, refreshToken: string) {
    const generatedUser = new User(user.id, user.email, jwtToken, user.favourite_recipes, user.created_recipes, user.custom_objects, user.settings, user.createdAt, user.updatedAt);
    this.userSub$.next(generatedUser);
    this.localStorageService.setToken(jwtToken);
    this.localStorageService.setRefreshToken(refreshToken);
    this.localStorageService.setUser(generatedUser);
  }

  getExpirationTimeFromToken(token: string | null) {
    const refreshToken = JSON.parse(atob(token!.split('.')[1]));
    return new Date(refreshToken.exp * 1000);
  }

  public getUser(): User | null {
    return this.userSub$.value;       
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
