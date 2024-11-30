import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  open: boolean = false;
  user: User | null | undefined;
  private userSub: Subscription | undefined;
  @Output() openStateChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.userSub$.subscribe(user => {
      this.user = user;
    });
  }
  onOpen() {
    this.open = !this.open;
    this.openStateChange.emit(this.open);
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
