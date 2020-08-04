import { Component } from '@angular/core';
import { AdminDataSharingService } from './admindatasharingservice';
import { ProjectstatusService } from './projectstatus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  adminLoggedIn: Boolean = false;

  constructor(private adminDataSharingService: AdminDataSharingService, private projectStatusService: ProjectstatusService, private router: Router) {

    // console.log("selected " + this.selectedLanguage.languagename)
    //LOAD admin toolbar links if admin is authenticated
    this.projectStatusService.checkAdminAuthentication()
      .subscribe(
        data => {
          this.adminLoggedIn = true;
        },
        error => {
          this.adminLoggedIn = false;
        }
      )
    this.adminDataSharingService.adminLoggedIn.subscribe(value => {
      this.adminLoggedIn = value;
    });
  }

  showAdminAgentPage() {
    this.projectStatusService.checkAdminAuthentication()
      .subscribe(
        data => {
          this.router.navigate(['/admin']);
        },
        error => {
          this.router.navigate(['/admin-login']);
        }
      )
  }
}


