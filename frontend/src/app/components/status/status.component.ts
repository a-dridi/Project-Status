import { Component, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { ProjectStage } from 'src/app/projectstage.model';
import { Project } from 'src/app/project.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  projectStages: ProjectStage[];
  loadedProject: Project;
  public projectStatusLoaded: boolean = false;
  public projectStatusDoesNotExist: boolean = false;
  loadingAnimation: Boolean = true;

  constructor(private router: Router, private projectstatusService: ProjectstatusService, private route: ActivatedRoute, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.projectstatusService.getProjectByIdAndEmail(params.get('projectid'), params.get('email')).subscribe((projectData: Project) => {

          if (projectData.client_email === params.get('email')) {
            this.loadedProject = projectData;
            console.log(this.loadedProject.finished);
            this.projectstatusService.getProjectStagesByProjectObjectId(params.get('projectid'))
              .subscribe((projectStagesData: ProjectStage[]) => {
                this.projectStages = projectStagesData;
                this.projectStatusLoaded = true;
                this.stopLoadingAnimation();
              }, (err) => {
                this.stopLoadingAnimation();
                this.projectStatusDoesNotExist = true;
              });
          } else {
            this.projectStatusDoesNotExist = true;
            this.stopLoadingAnimation();
          }
        }, (err) => {
          console.log("Project id or email is wrong!");
          this.projectStatusDoesNotExist = true;
          this.stopLoadingAnimation();
        });
      }
    );
  }

  openDefaultPage() {
    this.router.navigate(['/']);
  }

  stopLoadingAnimation(){
    setTimeout(() => { this.loadingAnimation = false }, 200);
  }



}
