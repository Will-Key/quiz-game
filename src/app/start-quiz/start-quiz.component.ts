import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.component.html',
  styleUrls: ['./start-quiz.component.scss']
})
export class StartQuizComponent implements OnInit {
  username: string | null = 'Sir'
  welcomeMsg!: string
  principeMsg!: string
  momentMsg!: string
  userData: any
  userResponse: any;

  constructor(
    private router: Router  
  ) { }

  ngOnInit() {
    console.log(localStorage.getItem('userData'));
    
    this.userData = JSON.parse(localStorage.getItem('userData')!) //? JSON.parse(localStorage.getItem('userData')!) : null
    this.userResponse = JSON.parse(localStorage.getItem('userResponse')!)
    

    if(this.userResponse != null) {
      if (this.userResponse!.email == this.userData.email && (this.userResponse!.answers).length < 20) {
        this.welcomeMsg = 'Welcome back on your game'
        this.principeMsg = 'You know the rule'
        this.momentMsg = 'continue'
      } else {
        this.welcomeMsg = 'This quiz consists of answering a series of 20 questions.'
        this.principeMsg = 'Each correct answer will be worth 1 point. There will be no penalty for wrong answer.'
        this.momentMsg = 'start'
      }  
    }else {
      this.welcomeMsg = 'This quiz consists of answering a series of 20 questions.'
      this.principeMsg = 'Each correct answer will be worth 1 point. There will be no penalty for wrong answer.'
      this.momentMsg = 'start'
    } 

    this.username = (this.userData.email).split("@")[0]
  }

  startQuiz() {
    this.router.navigate(['/quiz'])
  }

  ranking() {
    this.router.navigate(['/ranking'])
  }

}
