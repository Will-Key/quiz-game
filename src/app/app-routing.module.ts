import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { QuizComponent } from "./quiz/quiz.component";
import { RankingComponent } from "./ranking/ranking.component";
import { StartQuizComponent } from "./start-quiz/start-quiz.component";

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent
  },
  {
    path: 'start-quiz', component: StartQuizComponent
  },
  {
    path: 'ranking', component: RankingComponent
  },
  {
    path: 'quiz', component: QuizComponent
  },
  {
    path: '', redirectTo: '/auth', pathMatch: 'full'
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}