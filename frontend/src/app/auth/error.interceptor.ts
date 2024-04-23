import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if ([401, 403].includes(err.status)) {
                    this.authService.logOut();
                }
                const error = (err && err.error && err.error.message) || err.statusText;
                return throwError(() => new Error(error));
            })
        );
    }
}