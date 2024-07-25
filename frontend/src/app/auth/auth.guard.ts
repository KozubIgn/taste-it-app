import {Router} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    this.authService.userSub$.pipe(
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        } else {
          this.router.createUrlTree(['/auth']);
          return false;
        }
      })
    ).subscribe();
  }
}
