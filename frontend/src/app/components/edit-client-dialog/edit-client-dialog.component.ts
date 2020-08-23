import { Component, OnInit, Inject } from '@angular/core';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditClientDialogData } from 'src/app/editclientdialogdata.model';
import { FormGroup, FormBuilder } from '@angular/forms';

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

  constructor(public editClientDialogRef: MatDialogRef<EditClientDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: EditClientDialogData, private snackBar: MatSnackBar, private projectSatusService: ProjectstatusService, private editClientForm: FormBuilder) {
    this.updateClientForm = this.editClientForm.group({
      clientName: [''],
      clientEmail: [''],
      clientTelephone: ['']
    });
  }

  ngOnInit(): void {
    console.log("data name " + this.data.name);
    this.updateClientForm.get("clientName").setValue(this.data.name);
    this.updateClientForm.get("clientEmail").setValue(this.data.email);
    this.updateClientForm.get("clientTelephone").setValue(this.data.telephone);
  }

  updateClient(clientName, clientEmail, clientTelephone) {
    this.projectSatusService.updateClient(this.data.id, clientName, clientEmail, clientTelephone).subscribe(() => {
      this.snackBar.open($localize`Client was updated.`, "OK", { duration: 4000 });
      this.editClientDialogRef.close();
    }, err => {
      this.snackBar.open($localize`Error. Client could not be updated!`, "OK", { duration: 4000 });
    })
  }

  onCancelEdit() {
    this.editClientDialogRef.close();
  }

}
