import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.user$.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
