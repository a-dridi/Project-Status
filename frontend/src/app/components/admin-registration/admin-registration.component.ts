import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Router } from '@angular/router';
import { AdminAccount } from 'src/app/adminaccount.model';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {
  adminAccountCreated: boolean = true;
  registrationForm: FormGroup;
  namePlaceholder: String;
  emailPlaceholder: String;
  passwordPlaceholder: String;
  passwordconfirmationPlaceholder: String;
  telephonePlaceholder: String;
  notePlaceholder: String;
  constructor(private adminregistrationForm: FormBuilder, private router: Router, private snackBar: MatSnackBar, private projectStatusService: ProjectstatusService
  ) {
    this.namePlaceholder = $localize`Enter Name`;
    this.emailPlaceholder = $localize`Enter Email`;
    this.passwordPlaceholder = $localize`Enter Password`;
    this.passwordconfirmationPlaceholder = $localize`Enter Password again`;
    this.telephonePlaceholder = $localize`Enter Telephone number`;
    this.notePlaceholder = $localize`Optional note`;

    this.registrationForm = this.adminregistrationForm.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      telephone: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.projectStatusService
      .getAdminAccount()
      .subscribe((data: AdminAccount[]) => {
        if (data.length < 1) {
          this.adminAccountCreated = false;
        }
      });

  }

  registeradmin(name, email, password, password2, telephone, note) {
    if (!this.registrationForm.valid) {
      this.snackBar.open($localize`Please enter all required fields correctly!`, "OK", {
        duration: 10000
      });
      return;
    } else if (password != password2) {
      this.snackBar.open($localize`Password and Password confirmation must be the same!`, "OK", {
        duration: 10000
      });
      return;
    } else if (password.length < 6) {
      this.snackBar.open($localize`Password must be at least 6 characters long!`, "OK", {
        duration: 10000
      });
      return;
    }

    this.projectStatusService.doAdminRegistration(email, password, name, telephone, note)
      .subscribe(
        data => {
          this.router.navigate(['/admin-login']);
          this.snackBar.open($localize`OK. Registration is done. Please login with your account credentials now.`, "OK", {
            duration: 10000
          });
        },
        error => {
          console.log(error);

          this.snackBar.open($localize`Registration failed! Please enter all required fields correctly.`, "OK", {
            duration: 10000
          });
        }
      )
  }


}
