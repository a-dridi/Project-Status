import { Component, OnInit } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Project } from 'src/app/project.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  username: String = '';
  projects: Project[];
  projectsCreated: boolean = true;
  projectsColumns = ['projecttitle', 'status', 'startdate', 'enddate', 'customeremail', 'customertelephone', 'delete'];
  unfinishedText: String;
  finishedText: String;

  constructor(private projectstatusService: ProjectstatusService, private router: Router, private snackBar: MatSnackBar) {
    this.unfinishedText = $localize`UNFINISHED`;
    this.finishedText = $localize`finished`;
  }

  ngOnInit(): void {
    this.loadUsername();
    this.loadProjects();
  }

  loadUsername() {
    this.username = this.projectstatusService.adminName;
  }

  loadProjects() {
    this.projectstatusService.getAllProjects().subscribe((data: Project[]) => {
      this.projects = data;
      if (this.projects.length === 0) {
        this.projectsCreated = false;
      }
    });
  }

  editProject(id) {
    this.router.navigate([`/admin-edit/${id}`]);
  }

  deleteProject(id) {
    this.projectstatusService.deleteProjectById(id).subscribe(() => {
      this.loadProjects();
      this.snackBar.open($localize`OK! Project was deleted.`, "OK", { duration: 4000 });
    });
  }
}
