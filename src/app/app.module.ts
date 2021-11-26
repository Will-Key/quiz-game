import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  BrowserModule
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from 
'@angular/platform-browser/animations'
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { StartQuizComponent } from './start-quiz/start-quiz.component';
import { QuizComponent } from './quiz/quiz.component';

import { AuthService } from './auth/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { RankingComponent } from './ranking/ranking.component';

@NgModule({
  declarations: [					
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    StartQuizComponent,
    HeaderComponent,
    QuizComponent,
      RankingComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
