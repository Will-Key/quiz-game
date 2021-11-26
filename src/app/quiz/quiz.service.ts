import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface quesAndAns {
  question: string,
  correct_answer: string,
  incorrect_answers: string[],
  answers: string[]
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  questionQuiz = new BehaviorSubject<{
    question: string,
    correct_answer: string,
    incorrect_answers: string[],
    answers: string[]
  }[] | null>(null)

  userData: any
  userResponse: any;


  constructor(
  ) { }


  setQuestionsAndAnswers(resultFormated: {
      question: string,
      correct_answer: string,
      incorrect_answers: string[],
      answers: string[]
    }[]) {
    this.questionQuiz.next(resultFormated)
    //localStorage.setItem('quizData', JSON.stringify(resultFormated))
  }

}
