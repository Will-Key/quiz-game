import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AuthResponseData } from "../auth/auth.service";
import { QuizService } from "../quiz/quiz.service";
import { ResultModel } from "../quiz/result-model";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  userConnectData: AuthResponseData = JSON.parse(sessionStorage.getItem('userConnect')!)

  constructor(
    private http: HttpClient,
    private quizService: QuizService
  ) {}

  storedUserAnswers(quizAnswers: any) {
    const quiz_answers = quizAnswers
    this.http.post('https://quiz-time-7c41a-default-rtdb.firebaseio.com/quiz_answers.json', quiz_answers)
      .subscribe(
        (response) => {console.log(response)}
      )
      /* .pipe(
        map((response) => {
          console.log(response)
          return response
        })
      ) */
  }

  fetchAllQuizDone() {
    return this.http
      .get('https://quiz-time-7c41a-default-rtdb.firebaseio.com/quiz_answers.json')
  }

  fetchQuestionsAndResponse() {
    return this.http
      .get<ResultModel>(`https://opentdb.com/api.php?amount=20&category=18&type=multiple`)
      .pipe(
        catchError(this.handleError),
        map(
          (resDatas) => {
            return resDatas.results.map(resData => {
                let answers = resData.incorrect_answers
                answers.push(resData.correct_answer)
                return {
                  question: resData.question,
                  correct_answer: resData.correct_answer,
                  incorrect_answers: resData.incorrect_answers,
                  answers: answers
                }
              }
            )
          }
        ),
        tap(resDatas => {
          this.quizService.setQuestionsAndAnswers(resDatas)
        })
      )
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An unknown error occured!'
    if (!errorRes.error || !errorRes.error.message) {
      throwError(errorMsg)
    }
    switch (errorRes.error.status) {
      case 1:
        errorMsg = 'The request could not return results'
        break;
      default:
        break;
    }

    return throwError(errorMsg)
  }
}