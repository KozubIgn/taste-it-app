import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    const stringuser = localStorage.getItem('user');
    const user: User | null = JSON.parse(stringuser!);
    const token = localStorage.getItem('jwt-token');
    const isLoggedIn = user && token
    const isApiUrl = req.url.startsWith('http://localhost:5000');
    if (isLoggedIn && isApiUrl) {
      req = this.addTokenHeader(req, token);
    }
    return next.handle(req)
  }

  addTokenHeader(req: HttpRequest<any>, userToken: string) {
    return req.clone({ setHeaders: { 'access_token': userToken } });
  }
}
