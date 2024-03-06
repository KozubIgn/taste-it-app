import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthInterceptroService } from './auth/auth.interceptor.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeStartComponent } from './home-start/home-start.component';
import { ToastrModule } from 'ngx-toastr';
import { RecipesModule } from './recipies/modules/recipes.module';
import { SharedModule } from './shared/modules/shared.module';
import { AuthModule } from './auth/auth.module';
import { environment } from 'src/environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    HomeStartComponent,
    SidebarComponent,
    DashboardComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecipesModule,
    SharedModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // AngularFireModule.initializeApp(environment.firebase),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptroService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



