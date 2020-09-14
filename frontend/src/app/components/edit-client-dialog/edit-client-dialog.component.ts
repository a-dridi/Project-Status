import { Component, OnInit, Inject } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditClientDialogData } from 'src/app/editclientdialogdata.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Languages } from 'src/app/util/languages';

@Component({
  selector: 'app-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrls: ['./edit-client-dialog.component.css']
})
export class EditClientDialogComponent implements OnInit {

  clientNamePlaceholder: string = $localize`Client Name`;
  clientEmailPlaceholder: string = $localize`Client Email`;
  clientTelephonePlaceholder: string = $localize`Client Telephone`;
  updateClientForm: FormGroup;
  updateClientLanguagecode: string;
  languages: any;
  notificationMethod: string;

  constructor(public editClientDialogRef: MatDialogRef<EditClientDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: EditClientDialogData, private snackBar: MatSnackBar, private projectSatusService: ProjectstatusService, private editClientForm: FormBuilder) {
    this.updateClientForm = this.editClientForm.group({
      clientName: [''],
      clientEmail: [''],
      clientTelephone: ['']
    });
    this.languages = Languages.getLanguages();
  }

  ngOnInit(): void {
    console.log("data name " + this.data.name);
    this.updateClientForm.get("clientName").setValue(this.data.name);
    this.updateClientForm.get("clientEmail").setValue(this.data.email);
    this.updateClientForm.get("clientTelephone").setValue(this.data.telephone);
    this.updateClientLanguagecode = this.data.languagecode;
    this.notificationMethod=this.data.notificationmethod;
  }

  updateClient(clientName, clientEmail, clientTelephone) {
    this.projectSatusService.updateClient(this.data.id, clientName, clientEmail, clientTelephone, this.updateClientLanguagecode, this.notificationMethod).subscribe(() => {
      this.snackBar.open($localize`Client was updated.`, "OK", { duration: 4000 });
      this.editClientDialogRef.close();
    }, err => {
      this.snackBar.open($localize`Error. Client could not be updated!`, "OK", { duration: 4000 });
    })
  }

  onCancelEdit() {
    this.editClientDialogRef.close();
  }

  changeClientLanguage(newLanguageCode){
    this.updateClientLanguagecode=newLanguageCode;
  }

  changeNotificationMethod(newNotificationMethod){
    this.notificationMethod=newNotificationMethod;
    console.log(this.notificationMethod);
  }

}
