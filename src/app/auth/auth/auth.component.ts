import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error = null;
  authObs: Observable<AuthResponseData>;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onHandleError() {
    this.error = null;
  }
  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }
    this.error = null;
    const email = authForm.value.email;
    const pwd = authForm.value.password;
    this.isLoading = true;

    if (this.isLoginMode) {
      console.log('isLoading' + this.isLoading);
      this.authObs = this.authService.login(email, pwd);
    } else {
      console.log('isLoading' + this.isLoading);
      this.authObs = this.authService.signUp(email, pwd);
    }
    this.authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']); //redirect user
      }, //u r already getting the processed error message
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    // console.log(authForm.value)
  }
}
