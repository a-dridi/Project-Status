import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';
import { Languages } from 'src/app/util/languages';

@Component({
  selector: 'app-manage-clients-add',
  templateUrl: './manage-clients-add.component.html',
  styleUrls: ['./manage-clients-add.component.css']
})
export class ManageClientsAddComponent implements OnInit {

  newClientName: string;
  newClientEmail: string;
  newClientTelephone: string;
  newClientLanguagecode: string;
  newClientNotificationmethod: string = "email";
  addClientFormGroup: FormGroup;
  languages: any;

  constructor(private snackBar: MatSnackBar, private projectSatusService: ProjectstatusService, private addClientForm: FormBuilder, private router: Router) {
    this.addClientFormGroup = this.addClientForm.group({
      name: ['', Validators.required],
      email: [''],
      telephone: ['']
    });
    this.languages = Languages.getLanguages();
  }

  ngOnInit(): void {
  }

  addClient(name, email, telephone) {
    if (this.newClientName === "") {
      this.snackBar.open($localize`Please enter client name.`, "OK", { duration: 4000 });
      return;
    }
    if (this.newClientEmail === "") {
      this.snackBar.open($localize`Please enter client email.`, "OK", { duration: 4000 });
      return;
    }
    if (this.newClientTelephone === "") {
      this.snackBar.open($localize`Please enter client telephone number.`, "OK", { duration: 4000 });
      return;
    }
    this.projectSatusService.addClient(name, email, telephone, this.newClientLanguagecode, this.newClientNotificationmethod).subscribe(() => {
      location.reload();
      this.snackBar.open($localize`Client was added.`, "OK", { duration: 4000 });
    }, (err) => { this.snackBar.open($localize`Error! Client could not be added`, "OK", { duration: 4000 }); console.log(err); });
  }

  changeNotificationMethod(notificationMethodValue) {
    this.newClientNotificationmethod = notificationMethodValue;
  }
}
