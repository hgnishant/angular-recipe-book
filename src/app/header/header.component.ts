import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() featureSelected = new EventEmitter<string>();
  isAuthenticated = false;
  authSubs: Subscription;

  constructor(
    private storageService: DataStorageService,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.authservice.user.subscribe((userData) => {
      this.isAuthenticated = !!userData; //same as this.isAuthenticated = userData ? true :else
    });
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  onSaveData() {
    this.storageService.StoreRecipe();
  }

  onFetchData() {
    this.storageService.FetchRecipes().subscribe();
  }

  onlogOut(){
    this.authservice.logout();
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
