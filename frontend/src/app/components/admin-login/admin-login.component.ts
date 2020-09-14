import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { AdminAccount } from 'src/app/adminaccount.model';
import { AdminDataSharingService } from 'src/app/admindatasharingservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  animations: [trigger('errorSwiggle', [
    transition('false => true', animate('500ms ease-in',
      keyframes([
        style({ transform: 'translate3d(-1px, 0, 0', offset: 0.1 }),
        style({ transform: 'translate3d(2px, 0, 0', offset: 0.2 }),
        style({ transform: 'translate3d(-4px, 0, 0', offset: 0.3 }),
        style({ transform: 'translate3d(4px, 0, 0', offset: 0.4 }),
        style({ transform: 'translate3d(-4px, 0, 0', offset: 0.5 }),
        style({ transform: 'translate3d(4px, 0, 0', offset: 0.6 }),
        style({ transform: 'translate3d(-4px, 0, 0', offset: 0.7 }),
        style({ transform: 'translate3d(2px, 0, 0', offset: 0.8 })
      ])
    ))
  ])
  ]
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup;
  adminAccountCreated: boolean = true;
  emailPlaceholder: String;
  passwordPlaceholder: String;
  loginFailed: boolean = false;

  constructor(private adminDataSharingService: AdminDataSharingService, private adminLoginForm: FormBuilder, private router: Router, private projectStatusService: ProjectstatusService, private snackbar: MatSnackBar) {
    this.emailPlaceholder = "Your e-mail:";
    this.passwordPlaceholder = "Your password:";
  }

  ngOnInit(): void {
    this.projectStatusService
      .getAdminAccount()
      .subscribe((data: AdminAccount[]) => {
        if (data.length < 1) {
          this.adminAccountCreated = false;
        }
      });
    this.loginForm = this.adminLoginForm.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginAdmin() {
    if (!this.loginForm.valid) {
      this.snackbar.open($localize`Login failed! Please check your email or password`, "OK", { duration: 10000 });
      this.loginFailed=true;
      return;
    }

    this.projectStatusService.doAdminLogin(JSON.stringify(this.loginForm.value))
      .subscribe(
        data => {
          console.log("You are logged in now.");
          this.projectStatusService.adminName = this.loginForm.value.email;
          this.adminDataSharingService.adminLoggedIn.next(true);
          this.router.navigate(['/admin']);
          this.router.navigated = false;
        },

        error => {
          console.log("Login failed!");
          this.snackbar.open($localize`LOGIN FAILED. Please enter your correct email address and password of your admin account.`, "OK", {
            duration: 10000
          });
          this.loginFailed=true;
        }
      );
  }

}
