import { Component, OnInit } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-logout',
  templateUrl: './admin-logout.component.html',
  styleUrls: ['./admin-logout.component.css']
})
export class AdminLogoutComponent implements OnInit {

  constructor(private router: Router, private projectStatusService: ProjectstatusService, private snackBar: MatSnackBar, private spinnerModule: MatProgressSpinnerModule) {
  }


  ngOnInit(): void {
    this.projectStatusService.doAdminLogout()
      .subscribe(
        data => {
          console.log($localize`You are logged out now.`);
          this.router.navigate(['/admin-login']);
          this.snackBar.open($localize`You are logged out.`, "OK", {
            duration: 4000
          });
        },
        error => {
          this.snackBar.open($localize`LOGOUT FAILED.`, "OK", {
            duration: 4000
          });
        }
      )

  }

}
