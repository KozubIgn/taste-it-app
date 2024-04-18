import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DataStorageService } from '../shared/services/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() featureSelected = new EventEmitter<string>();

  isAuthenticated = false;
  private userSub: Subscription | undefined;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.userSub$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
  onSaveData() {

  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
