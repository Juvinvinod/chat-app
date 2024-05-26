import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private _router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginSubscription = this.authService
        .userLogin(this.loginForm.value)
        .subscribe({
          next: res => {
            console.log(res);
            localStorage.setItem('user', JSON.stringify(res));
            this._router.navigate(['../']);
          },
        });
    } else {
      this.snackBar.open('Invalid details', 'Dismiss', {
        duration: 5000,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
