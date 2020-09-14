import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Project } from 'src/app/project.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  username: String = '';
  projects: Project[];
  projectsSorted: Project[];
  projectsDataSource;
  projectsCreated: boolean = true;
  projectsColumns = ['projecttitle', 'status', 'startdate', 'enddate', 'customeremail', 'customertelephone', 'delete'];
  unfinishedText: String;
  finishedText: String;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  projectsFilterPlaceholder: string;

  constructor(private projectstatusService: ProjectstatusService, private router: Router, private snackBar: MatSnackBar) {
    this.unfinishedText = $localize`UNFINISHED`;
    this.finishedText = $localize`finished`;
    this.projectsFilterPlaceholder = $localize`Search Projects`;
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
      this.projectsSorted = this.projects;
      this.projectsDataSource = new MatTableDataSource(this.projectsSorted);
      this.projectsDataSource.sort = this.sort;
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

  sortProjectsTable(sort: Sort) {
    //Restore normal sort order
    if (!sort.active || sort.direction === '') {
      this.projectsSorted = this.projects.slice();
      return;
    }

    this.projectsSorted = this.projects.sort((a, b) => {
      const isAscending = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return this.compareTableValue(a.title.toLowerCase(), b.title.toLowerCase(), isAscending);
        case 'status': return this.compareTableValue(a.finished ? 'finished ' : 'unfinished', b.finished ? 'finished ' : 'unfinished', isAscending);
        case 'startdate': return this.compareTableDateValue(a.created_date, b.created_date, isAscending);
        case 'endate': return this.compareTableDateValue(a.end_date, b.end_date, isAscending);
        case 'customeremail': return this.compareTableValue(a.client_email.toLowerCase(), b.client_email.toLowerCase(), isAscending);
        case 'customertelephone': return this.compareTableValue(a.client_telephone, b.client_telephone, isAscending);
        default: return 0;
      }
    });
  }

  compareTableValue(a: number | string, b: number | string, isAscending) {
    return (a < b ? -1 : 1) * (isAscending ? 1 : -1);
  }

  compareTableDateValue(a: Date, b: Date, isAscending) {
    return new Date(a).getTime() - new Date(b).getTime() * (isAscending ? 1 : -1);
  }

  filterProjects(filterValue: string) {
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }

}
