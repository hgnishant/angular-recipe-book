import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

//taken from firebase API
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null); // to emit a new user when created after login on demand
  private tokenExpirationTimer :any;
  constructor(private http: HttpClient, private router: Router) {}

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenexpirationDate: string;
    } = JSON.parse(localStorage.getItem('UserData'));
    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenexpirationDate)
    );

    if(loadedUser.token)//if valid throug getter()
    {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenexpirationDate).getTime()-new Date().getTime();//calculate the duration 
      this.autoLogout(expirationDuration);
    }
  }

  signUp(sEmail: string, sPassword: string) {
    //url taken from firebase reference docs for endpoint
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyClfO1Cnf_c24C5AHvOE1rYgV_s1DSrLUM',
        {
          email: sEmail,
          password: sPassword,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.HandleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
        // const expirationDate = new Date(
        //   new Date().getTime() + +resData.expiresIn * 1000
        // );
        // const user = new User(
        //   resData.email,
        //   resData.localId,
        //   resData.idToken,
        //   expirationDate
        // );
        // this.user.next(user);
        // })
      ); //pass to a function the below code

    //old approach below
    // .pipe(
    //   catchError((errorRes) => {
    //     let errorMessage = 'An error occured!';
    //     if (!errorRes.error || !errorRes.error.error)
    //       return throwError(errorMessage);
    //     switch (errorRes.error.error.message) {
    //       case 'EMAIL_EXISTS':
    //         errorMessage = 'Email already exists.';
    //     }
    //     return throwError(errorMessage);//now handle this throw error where u subscribe to this
    //   })
    // );
  }

  login(sEmail: string, sPassword: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyClfO1Cnf_c24C5AHvOE1rYgV_s1DSrLUM',
        {
          email: sEmail,
          password: sPassword,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.HandleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('UserData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  autoLogout(expirationDuration:number){
    //based on 1 hour timer
    this.tokenExpirationTimer=setTimeout(()=>{
      this.logout();
    },expirationDuration);

  }

  private handleAuthentication(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn*1000);//call after emit to check 
    //save user infor in local storage otherwise it will be lost
    localStorage.setItem('UserData', JSON.stringify(user));

  }

  private HandleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occured!';
    if (!errorRes.error || !errorRes.error.error)
      return throwError(errorMessage);
    switch (errorRes.error.error.message) {
      //sign up codes below
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      //sign in codes below
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage =
          'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errorMessage =
          'The user account has been disabled by an administrator.';
        break;
    }
    return throwError(errorMessage);
  }
}
