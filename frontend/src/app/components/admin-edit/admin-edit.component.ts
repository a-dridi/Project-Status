import { Component, OnInit } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/project.model';
import { ProjectStage } from 'src/app/projectstage.model';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { EmailtTextTemplateTexts } from 'src/app/emailTextTemplateTexts';
import { SmsTextTemplateTexts } from 'src/app/smsTextTemplateTexts';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {
  startdatePlaceholder: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  emailPlaceholder: string;
  telephonePlaceholder: string;
  enddatePlaceholder: string;
  stageTitlePlaceholder: string;
  stageDescriptionPlaceholder: string;
  selectedProject: Project;
  selectedProjectStages: ProjectStage[];
  editForm: FormGroup;
  projectStagesForm: FormGroup;
  projectStageNumberCounter: number = 1;
  //Has the index of the first new project stage - 0 if no new project stages were added
  newProjectStagesStartIndex: number = 0;
  projectFinished: boolean = false;
  amountOfFinishedProjectStages: number = 0;
  projectStagesLastIndex: number = 0;
  updatedStartdate: string;
  updatedTitle: string;
  updatedDescription: string;
  updatedEmail: string;
  updatedTelephone: string;
  updatedEnddate: string;
  //Default: complete notification - 0: no notification - 1: only project end notification - 2: complete notification
  notificationType: number = 2;
  notificationSent: boolean = false;
  enddateEmailString: string = "";

  constructor(private projectstatusService: ProjectstatusService, private projectForm: FormBuilder, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.startdatePlaceholder = $localize`Start Date`;
    this.titlePlaceholder = $localize`Project Title`;
    this.descriptionPlaceholder = $localize`Project Description`;
    this.emailPlaceholder = $localize`Customer/Client Email`;
    this.telephonePlaceholder = $localize`Customer/Client Telephone`;
    this.startdatePlaceholder = $localize`End Date`;
    this.stageTitlePlaceholder = $localize`Project Stage Title`;
    this.stageDescriptionPlaceholder = $localize`Project Stage Description`;

    this.editForm = this.projectForm.group({
      startdate: [''],
      title: ['', Validators.required],
      description: [''],
      email: ['', Validators.required],
      telephone: [''],
      enddate: ['']
    });

    this.projectStagesForm = this.projectForm.group({
      projectStagesInput: this.projectForm.array([])
    });

  }

  /**
   * Check if user is authenticated. Load called project id. If it does not exist, then redirect to admin page. 
   */
  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.projectstatusService.getProjectById(params.projectid).subscribe((data: Project) => {
          this.selectedProject = data;
          //console.log(this.selectedProject.client_email);
          this.loadProjectFormValues(this.selectedProject);
          this.projectstatusService.getProjectStagesByProjectObjectId(params.projectid).subscribe((data: ProjectStage[]) => {
            this.selectedProjectStages = data;
            //console.log(this.selectedProjectStages[0].title);
            this.loadProjectStagesFormValues(this.selectedProjectStages);
          });
        }, error => {
          this.router.navigate(['/admin-login']);
        });
      });
  }

  loadProjectFormValues(selectedProject) {
    this.editForm.get("startdate").setValue(selectedProject.created_date);
    this.editForm.get("title").setValue(selectedProject.title);
    this.editForm.get("description").setValue(selectedProject.description);
    this.editForm.get("email").setValue(selectedProject.client_email);
    this.editForm.get("telephone").setValue(selectedProject.client_telephone);
    this.editForm.get("enddate").setValue(selectedProject.end_date);
  }

  loadProjectStagesFormValues(selectedProjectStages) {
    let i = 0;
    while (i < selectedProjectStages.length) {
      (this.projectStagesForm.controls['projectStagesInput'] as FormArray).push(this.setProjectStageInputItem(i, selectedProjectStages[i].stage_number, selectedProjectStages[i].title, selectedProjectStages[i].description, selectedProjectStages[i].finished));
      i += 1;
    }
    this.projectStageNumberCounter = selectedProjectStages.length;
  }

  /**
   * Returns a form for one project stage with the passed values. This form will be added to a form group that has all project stages for a project. 
   * @param stageId 
   * @param stageNumber 
   * @param stageTitle 
   * @param stageDescription 
   * @param finished 
   */
  setProjectStageInputItem(stageId, stageNumber, stageTitle, stageDescription, finished) {
    return this.projectForm.group({
      ['stageNumber' + stageId]: [stageNumber],
      ['stageTitle' + stageId]: [stageTitle],
      ['stageDescription' + stageId]: [stageDescription],
      ['finished' + stageId]: [finished]
    });
  }

  addNewProjectStageInput() {
    this.projectStageNumberCounter += 1;
    //The index from where new project stages are saved/added. From this index project stages are added and not updated.
    this.newProjectStagesStartIndex = this.selectedProjectStages.length;

    (this.projectStagesForm.controls['projectStagesInput'] as FormArray).push(this.setProjectStageInputItem(this.projectStageNumberCounter - 1, this.projectStageNumberCounter, $localize`Project Stage Title`, $localize`Project Stage Description`, false));
  }

  /**
   * Updates Project and Project Stages
   */
  editProject(startdate, title, description, email, telephone, enddate, sendNotification) {
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
    }
    this.updatedStartdate = startDateFinalString;
    this.updatedEnddate = endDateFinalString;
    this.updatedTitle = title;
    this.updatedDescription = description;
    this.updatedEmail = email;
    this.updatedTelephone = telephone;
    this.enddateEmailString = enddate;
    this.saveProjectStages();
  }

  /**
   * Update project stages and add new project stages. Part of editProject
   */
  saveProjectStages() {
    let projectStagesFormArray = (this.projectStagesForm.controls['projectStagesInput'] as FormArray);
    let i = 0;
    this.projectStagesLastIndex = projectStagesFormArray.controls.length - 1;

    //let projectStagesLastIndex = this.selectedProjectStages.length-1;
    projectStagesFormArray.controls.forEach((projectStagesFormElement, index) => {
      this.updateProjectStage(projectStagesFormElement, index);
    });
  }

  /**
   * Updates a project stage. If it is the last project stage, then the project will be updated and a project notification will be sent.
   * @param projectStagesFormElement 
   * @param index the current index of the Array "projectStagesFormElement"
   */
  updateProjectStage(projectStagesFormElement, index) {
    const stageNumberOfElement = Number.parseInt(projectStagesFormElement.get(['stageNumber' + index]).value);
    const stageTitleOfElement = projectStagesFormElement.get(['stageTitle' + index]).value;
    const stageDescriptionOfElement = projectStagesFormElement.get(['stageDescription' + index]).value;
    const stageFinishedOfElement = projectStagesFormElement.get(['finished' + index]).value;

    if (stageFinishedOfElement === true) {
      this.amountOfFinishedProjectStages += 1;
    }

    //Update existing project stages only
    if (this.newProjectStagesStartIndex === 0) {
      this.projectstatusService.updateProjectStageById(this.selectedProjectStages[index]._id, stageNumberOfElement, stageTitleOfElement, stageDescriptionOfElement, stageFinishedOfElement, this.selectedProject._id).subscribe(() => {
        if (index === this.projectStagesLastIndex) {
          this.updateProject(this.updatedStartdate, this.updatedTitle, this.updatedDescription, this.updatedEmail, this.updatedTelephone, this.updatedEnddate, this.enddateEmailString);
          this.router.navigate(['/admin']);
        }
      });
    } else {
      //Updating existing project stages is done - New project stages will be added
      if (index >= this.newProjectStagesStartIndex) {
        this.projectstatusService.addProjectStage(stageNumberOfElement, stageTitleOfElement, stageDescriptionOfElement, stageFinishedOfElement, this.selectedProject._id).subscribe(() => {
        });
      } else {
        //Update existing project stages
        this.projectstatusService.updateProjectStageById(this.selectedProjectStages[index]._id, stageNumberOfElement, stageTitleOfElement, stageDescriptionOfElement, stageFinishedOfElement, this.selectedProject._id).subscribe(() => {
          this.snackBar.open($localize`OK. Project was updated.`, "OK", {
            duration: 4000
          });
        });
      }
      if (index === this.projectStagesLastIndex) {
        this.updateProject(this.updatedStartdate, this.updatedTitle, this.updatedDescription, this.updatedEmail, this.updatedTelephone, this.updatedEnddate, this.enddateEmailString);
        this.router.navigate(['/admin']);
      }
    }
  }

  /**
   * Update project and mark it as finished when all project stages are finished
   * @param startdate 
   * @param title 
   * @param description 
   * @param email 
   * @param enddate 
   * @param sendNotification
   */
  updateProject(startdate, title, description, email, telephonenumber, enddate, enddateEmailString) {
    //Send a "project completed" notification if project is finished and a "step finished" notification if a stage is finished
    if (this.amountOfFinishedProjectStages === this.projectStagesLastIndex) {
      this.projectFinished = true;
      if (this.notificationType > 0) {
        this.sendProjectFinishedNotification(email, telephonenumber, title);
      }
    } else {
      if (this.notificationType > 1) {
        this.sendProjectStageFinishedNotification(this.selectedProject._id, email, telephonenumber, title, enddateEmailString, this.amountOfFinishedProjectStages, this.projectStagesLastIndex);
      }
    }

    this.projectstatusService.updateProject(this.selectedProject._id, startdate, title, description, email, telephonenumber, enddate, this.projectFinished, this.notificationType).subscribe(() => {
      this.snackBar.open($localize`OK. Project was updated.`, "OK", {
        duration: 6000
      });
    });
  }

  /**
   * Send an email to the customer email address. If the client number is set, then an sms will be sent instead. Tells the customer that the project finished. 
   */
  sendProjectFinishedNotification(clientEmail, clientTelephoneNumber, projectTitle) {
    this.projectstatusService.getAuthenticatedAdminAccount().subscribe(adminaccount => {
      let emailSubject = EmailtTextTemplateTexts.projectFinishedSubject + projectTitle;
      let emailText = EmailtTextTemplateTexts.projectFinishedText + "<br><br>" + EmailtTextTemplateTexts.projectFinishedFooter + "<br>" + adminaccount['name'];

      if (!this.notificationSent) {
        if (clientTelephoneNumber === "") {
          this.projectstatusService.sendEmailNotificationClient(clientEmail, emailSubject, emailText, adminaccount['name'], adminaccount['email']).subscribe(() => {
            console.log("Email notification to customer sent");
          });
        } else {
          const smsText = SmsTextTemplateTexts.projectFinishedText + "\n" + SmsTextTemplateTexts.projectFinishedFooter + "\n" + adminaccount['name'];
          this.projectstatusService.sendSMSNotificationClient(clientTelephoneNumber, smsText).subscribe(() => {
            console.log("SMS notification to customer sent");
          });
        }
      }
      this.notificationSent = true;
    });
  }

  sendProjectStageFinishedNotification(projectId, clientEmail, clientTelephoneNumber, projectTitle, enddateEmailString, stageNumber, allStageNumber) {
    this.projectstatusService.getAuthenticatedAdminAccount().subscribe(adminaccount => {
      let emailSubject = $localize`Project Step ` + stageNumber + `/` + allStageNumber + $localize` finished - ` + projectTitle;
      let emailText;
      let projectStatusLink = EmailtTextTemplateTexts.appWebsiteURL + clientEmail + "/" + projectId;

      if (enddateEmailString !== "") {
        emailText = $localize`This project step was completed: ` + this.selectedProjectStages[stageNumber - 1].title + "<br><br>" + $localize`You can check the project status at this site: ` + "<br><br>" + "<a href=\"" + projectStatusLink + "\">" + projectStatusLink + "</a>" + "<br><br>" + EmailtTextTemplateTexts.projectStartedTextProjectEnd + "<br>" + enddateEmailString + "<br><br>" + EmailtTextTemplateTexts.projectStartedTextFooter + "<br>" + adminaccount['name'];
      } else {
        emailText = $localize`A project step was completed. You can check the project status at this site: ` + "<br><br>" + "<a href=\"" + projectStatusLink + "\">" + projectStatusLink + "</a>" + "<br><br>" + EmailtTextTemplateTexts.projectStartedTextFooter + "<br>" + adminaccount['name'];
      }

      if (!this.notificationSent) {
        if (clientTelephoneNumber === "") {
          this.projectstatusService.sendEmailNotificationClient(clientEmail, emailSubject, emailText, adminaccount['name'], adminaccount['email']).subscribe(() => {
            console.log("Email notification to customer sent");
          });
        } else {
          const smsText = emailSubject + $localize`This project step was completed: ` + this.selectedProjectStages[stageNumber - 1].title + "\n" + $localize`You can check the project status at this site: ` + "\n" + projectStatusLink + "\n" + EmailtTextTemplateTexts.projectStartedTextProjectEnd + "\n" + enddateEmailString + "\n" + EmailtTextTemplateTexts.projectStartedTextFooter + "\n" + adminaccount['name'];
          this.projectstatusService.sendSMSNotificationClient(clientTelephoneNumber, smsText).subscribe(() => {
            console.log("SMS notification to customer sent");
          });
        }
      }
      this.notificationSent = true;
    });
  }
}
