import { Component, OnInit } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectStage } from 'src/app/projectstage.model';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Project } from 'src/app/project.model';
import { EmailtTextTemplateTexts } from 'src/app/emailTextTemplateTexts';

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit {
  createForm: FormGroup;
  startdatePlaceholder: String;
  titlePlaceholder: String;
  descriptionPlaceholder: String;
  emailPlaceholder: String;
  enddatePlaceholder: String;
  stageTitlePlaceholder: String;
  stageDescriptionPlaceholder: String;
  projectStagesForm: FormGroup;
  projectStages: ProjectStage[];
  projectStageNumberCounter: number = 1;
  projectStageIdCounter: number = 0;
  enddateEmailString: String = "";

  constructor(private projectstatusService: ProjectstatusService, private projectForm: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.startdatePlaceholder = $localize`Start Date`;
    this.titlePlaceholder = $localize`Project Title`;
    this.descriptionPlaceholder = $localize`Project Description`;
    this.emailPlaceholder = $localize`Customer/Client Email`;
    this.startdatePlaceholder = $localize`Start Date`;
    this.stageTitlePlaceholder = $localize`Project Stage Title`;
    this.stageDescriptionPlaceholder = $localize`Project Stage Description`;
  }

  ngOnInit(): void {
    this.projectstatusService.checkAdminAuthentication().subscribe(
      data => {
      },
      error => {
        this.router.navigate(['/admin-login']);
      }
    );

    this.createForm = this.projectForm.group({
      startdate: [''],
      title: ['', Validators.required],
      description: [''],
      email: ['', Validators.required],
      enddate: ['']
    });

    this.projectStagesForm = this.projectForm.group({
      projectStagesInput: this.projectForm.array([this.createProjectStageInputItem()])
    });
  }

  /**
   *  Returns an empty form for one project stage with example values (template). This form will be added to a form group that has all project stages for a project. 
   */
  createProjectStageInputItem() {
    return this.projectForm.group({
      ['stageNumber' + this.projectStageIdCounter]: [this.projectStageNumberCounter],
      ['stageTitle' + this.projectStageIdCounter]: [$localize`Project Stage Title`],
      ['stageDescription' + this.projectStageIdCounter]: [$localize`Project Stage Description`]
    });
  }

  addNewProjectStageInput() {
    this.projectStageIdCounter += 1;
    this.projectStageNumberCounter += 1;
    (this.projectStagesForm.controls['projectStagesInput'] as FormArray).push(this.createProjectStageInputItem());
  }

  /**
   * Save all project stages for the passed project id.
   * @param projectId 
   */
  saveProjectStages(projectId) {
    let projectStagesFormArray = (this.projectStagesForm.controls['projectStagesInput'] as FormArray);
    let index = 0;
    let projectStagesLastIndex = projectStagesFormArray.controls.length;
    for (const projectStagesFormElement of projectStagesFormArray.controls) {
      const stageNumberOfElement = Number.parseInt(projectStagesFormElement.get(['stageNumber' + index]).value);
      const stageTitleOfElement = projectStagesFormElement.get(['stageTitle' + index]).value;
      const stageDescriptionOfElement = projectStagesFormElement.get(['stageDescription' + index]).value;

      this.projectstatusService.addProjectStage(stageNumberOfElement, stageTitleOfElement, stageDescriptionOfElement, false, projectId).subscribe(() => {
        //Display success message after adding the last project stage
        if (index === projectStagesLastIndex) {
          this.router.navigate(['/admin']);
          this.snackBar.open($localize`OK. Project was created. `, "OK", {
            duration: 6000
          });
        }
      }, (err) => {
        //Stop adding all project stages, when an error occured. 
        this.snackBar.open($localize`Error. Cannot save project stages and project. `, "OK", {
          duration: 7000
        });
        console.log(err);
        return;
      });
      index += 1;
    }
  }

  /**
   * Add project and get project id which will be passed to the method saveProjectStages(projectId). This method will then save all project stages for this project. 
   * @param title 
   * @param description 
   * @param startdate 
   * @param enddate 
   * @param email 
   */
  addProject(title, description, startdate, enddate, email) {
    //Parse date into ISO-8601 format
    let parsedStartDate = new Date();
    let parsedEndDate = new Date();
    let startDateFinalString = parsedStartDate.toString();
    let endDateFinalString = "";
    if (startdate != null && startdate !== "") {
      parsedStartDate = new Date(startdate.split("/").reverse().join("/"));
      startDateFinalString = parsedStartDate.toString();
    }
    if (enddate != null && enddate !== "") {
      parsedEndDate = new Date(enddate.split("/").reverse().join("/"));
      endDateFinalString = parsedEndDate.toString();
      this.enddateEmailString = enddate;
    }

    this.projectstatusService.addProject(startDateFinalString, title, description, email, endDateFinalString).subscribe((savedProjectId: String) => {
      if (savedProjectId) {
        this.saveProjectStages(savedProjectId);
        this.sendProjectStartedNotification(title, email, savedProjectId, this.enddateEmailString);
      }
    }, (err) => {
      this.snackBar.open($localize`Error. Cannot create project. `, "OK", {
        duration: 7000
      });
      console.log(err);
    });
  }

  /**
 * Send an email to the customer email address. Tells the customer that the project started and provides the status link and project end date (if set). 
 */
  sendProjectStartedNotification(projectTitle, clientEmail, projectId, projectEndDate) {
    this.projectstatusService.getAuthenticatedAdminAccount().subscribe(adminaccount => {
      let emailSubject = EmailtTextTemplateTexts.projectStartedSubject + projectTitle;
      let emailText;
      let projectStatusLink = EmailtTextTemplateTexts.appWebsiteURL + clientEmail + "/" + projectId;

      if (projectEndDate !== "") {
        emailText = EmailtTextTemplateTexts.projectStartedTextGreeting + "<br><br>" + "<a href=\"" + projectStatusLink + "\">" + projectStatusLink + "</a>" + "<br><br>" + EmailtTextTemplateTexts.projectStartedTextProjectEnd + "<br>" + projectEndDate + "<br><br>" + EmailtTextTemplateTexts.projectStartedTextFooter + "<br>" + adminaccount['name'];
      } else {
        emailText = EmailtTextTemplateTexts.projectStartedTextGreeting + "<br><br>" + "<a href=\"" + projectStatusLink + "\">" + projectStatusLink + "</a>" + "<br><br>" + EmailtTextTemplateTexts.projectStartedTextFooter + "<br>" + adminaccount['name'];
      }

      this.projectstatusService.sendEmailNotificationClient(clientEmail, emailSubject, emailText, adminaccount['name'], adminaccount['email']).subscribe(() => {
        console.log("Email notification to customer sent");
      });
    });
  }

  /**
   * Send sms to the customer telephone number
   */
  sendProjectStartedSMS() {

  }
}
