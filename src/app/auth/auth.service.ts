import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";

import { User } from "./auth.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken: string | null = null
  user = new BehaviorSubject<User|null>(null)
  authMethod = new BehaviorSubject<number>(0)
  private tokenExpirationTimer: any

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+ environment.firebaseAPIKEY,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.userToken = resData.idToken
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })
    )
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+ environment.firebaseAPIKEY,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.userToken = resData.idToken
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })
    )
  }

  autoLogin() {
    const userData: {
      email: string
      id: string
      _token: string
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData')!)
    console.log(userData)
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token,
      new Date(userData._tokenExpirationDate))

    if (loadedUser.token) {
      this.user.next(loadedUser)
      this.authMethod.next(1)
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  logout() {
    this.user.next(null)
    localStorage.removeItem('userData')
    this.router.navigate(['/auth'])
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      //this.logout()
    }, expirationDuration)
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate)
    
    localStorage.setItem('userData', JSON.stringify(user))

    this.user.next(user)
    this.authMethod.next(0)
    this.autoLogout(expiresIn * 1000)
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!'
    if (!errorRes.error || !errorRes.error.message) {
      throwError(errorMessage)
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!'
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is not correct!'
        break;
      case 'USER_DISABLED':
        errorMessage = 'Your account is disabled!'
        break;
    }

    return throwError(errorMessage)
  }
}

