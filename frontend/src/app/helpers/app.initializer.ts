import { catchError, of } from "rxjs";
import { AuthService } from "../auth/auth.service";

export function appInitializer(authService: AuthService) {
    return () => authService.refreshToken()
        .pipe(
            catchError(() => of())
        );
}