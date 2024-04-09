import { catchError, firstValueFrom, of } from "rxjs";
import { AuthService } from "../auth/auth.service";


export function appInitializer(authService: AuthService) {
    return () => authService.refreshToken()
        .pipe(
            // catch error to start app on success or failure
            catchError(() => of())
        );
}