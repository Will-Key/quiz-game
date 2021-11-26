import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @ViewChild('email') inputEmail: any
  @ViewChild('password') inputPassword: any
  isLoginMode = false
  isLoading = false
  error: string | null = null

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.user.subscribe(
      (user) => {
        console.log(user)
        if (!user) {
          return;
        }
        this.router.navigate(['/start-quiz'])
      }
    )
  }

  onSwitchMode() {
    this.inputEmail.nativeElement.value = ''
    this.inputPassword.nativeElement.value = ''
    this.isLoginMode = !this.isLoginMode
    console.log(this.isLoginMode);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    
    const email = form.value.email
    const password = form.value.password

    let authObs: Observable<AuthResponseData>
    
    this.isLoading = true
    
    if (!this.isLoginMode) {
      authObs = this.authService.login(email, password)
    } else {
      authObs = this.authService.signup(email, password)
    }

    authObs.subscribe(
      resData => {
        console.log(resData)
        this.isLoading = false
        this.router.navigate(['/start-quiz'])
      },
      errorRes => {
        this.error = errorRes
        console.log(errorRes)
        this.isLoading = false
      }
    )

    //form.reset()
  }

  onHandleError() {
    this.error = null
  }



}
