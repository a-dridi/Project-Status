import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  statusForm: FormGroup;

  constructor(private router: Router, private statusFormBuild: FormBuilder) {
    this.statusForm = this.statusFormBuild.group({
      email: ['', Validators.required],
      projectnumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  checkstatus(email, projectnumber) {
    this.router.navigate(['/status/' + email + '/' + projectnumber]);
  }
}
