import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  open: boolean = false;
  isAuthenticated = false;
  user: User | null | undefined;
  private userSub: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.user = user;
    });
  }
  onOpen() {
    this.open = !this.open;
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
