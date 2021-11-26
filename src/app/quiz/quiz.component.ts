import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  questionNum = 0
  score: number = 0
  questionsAnswers!: {
    question: string,
    correct_answer: string,
    incorrect_answers: string[],
    answers: string[]
  }[] | null
  userAnswers: string[] = []
  answers: string[] = []
  userData: any
  userResponse: any
  isLoading: boolean = false
  isGameOver: boolean = false
  email!: string
  error: boolean = false
  
  constructor(
    private quizService: QuizService,
    private dataStorageService: DataStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true

    this.userData = JSON.parse(localStorage.getItem('userData')!)
    this.email = this.userData.email
    //.questionsAnswers = JSON.parse(localStorage.getItem('quizData')!)
    this.userData = JSON.parse(localStorage.getItem('userData')!) //? JSON.parse(localStorage.getItem('userData')!) : null
    this.userResponse = JSON.parse(localStorage.getItem('userResponse')!)
    
    if (this.userResponse != null ) {
      console.log('Data available for this user')
      console.log(this.userResponse)
      console.log(this.userResponse.email)
      console.log(this.userData.email)
      console.log(this.userResponse.answers)
      if (this.userResponse.email == this.userData.email && (this.userResponse.answers).length < 20) {
        this.isLoading = false
        this.userAnswers = this.userResponse.answers.slice()
        this.score = this.userResponse.score
        this.questionsAnswers = this.userResponse.questions
      } else {
        this.dataStorageService.fetchQuestionsAndResponse().subscribe(
          async (questions) => {
            this.isLoading = false
            await console.log(questions)
            return this.questionsAnswers = await questions
          },
          (err) => {
            return this.error = err
          }
        )
      }  
    } else {
      console.log('No data for this user')
      this.dataStorageService.fetchQuestionsAndResponse().subscribe(
        async (questions) => {
          this.isLoading = false
          await console.log(questions)
          this.questionsAnswers = await questions
          return console.log(this.questionsAnswers, this.isLoading)
        },
        (err) => {
          return this.error = err
        }
      )
    }
    
    console.log(this.questionsAnswers);
  }

  onAnswering(indexAnswer: number) {
    this.isLoading = true
    console.log(this.userAnswers.length, this.questionsAnswers?.length)
    if (this.userAnswers.length === this.questionsAnswers?.length) {
      this.answers = this.questionsAnswers![this.questionNum].answers
      const response = this.answers[indexAnswer]
      const correctAnswer = this.questionsAnswers![this.questionNum].correct_answer
      this.verifyUserResponse(response, correctAnswer)
    }
    setTimeout(() => {
      this.isLoading = false

      this.answers = this.questionsAnswers![this.questionNum].answers
      const response = this.answers[indexAnswer]
      const correctAnswer = this.questionsAnswers![this.questionNum].correct_answer
      this.verifyUserResponse(response, correctAnswer)
    }, 1000);
    
  }

  private verifyUserResponse(response: string, correctAnswer: string) {
    if (response === correctAnswer) {
      this.score = this.score + 1
    }
    //this.questionNum = this.questionNum + 1
    this.keepUserResponse(response)
  }

  private keepUserResponse(answer: string) {
    this.userAnswers.push(answer)
    const userObject = {
      email: this.email,
      questions: this.questionsAnswers,
      score: this.score,
      answers: this.userAnswers
    }
    localStorage.setItem('userResponse', JSON.stringify(userObject))
    
    if(this.userAnswers.length === this.questionsAnswers?.length) {
      // Send data to server
      this.isLoading = false
      this.isGameOver = true
      this.dataStorageService.storedUserAnswers(userObject)
      
    }
  }

  onViewRank() {
    this.router.navigate(['/ranking'])
  }

  onRestart() {
    console.log("On restart")
    this.isGameOver = false
    sessionStorage.removeItem('userResponse')
    this.router.navigate(['/start-quiz'])
  }

}
