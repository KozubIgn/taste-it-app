import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { exhaustMap, take, tap } from 'rxjs';

@Injectable()
export class AuthInterceptroService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user$.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          setHeaders: {
            access_token: user.token!
          },
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
