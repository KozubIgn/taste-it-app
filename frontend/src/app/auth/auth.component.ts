import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // loginWithGoogle() {
  //   this.authService.GoogleAuth().then(() => {
  //     this.router.navigate(['/dashboard']);
  //   })
  // }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    let authObs: Observable<AuthResponseData>;
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe({
      next: (responseData) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.authService.handleError(error);
        this.error = error;
        this.isLoading = false;
      }
    });
    form.reset();
  }
}
