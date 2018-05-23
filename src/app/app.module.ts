import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';


import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { DbHandlerComponent } from './db-handler/db-handler.component';
import { ScramblerComponent } from './scrambler/scrambler.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { StatsWindowComponent } from './stats-window/stats-window.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FocusRemover } from './focus-remover.directive';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StopwatchComponent,
    DbHandlerComponent,
    ScramblerComponent,
    LoginButtonComponent,
    StatsWindowComponent,
    DeleteDialogComponent,
    FocusRemover
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,

    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatInputModule
  ],
  entryComponents: [
    DeleteDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
