import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectstatusService } from 'src/app/projectstatus.service';

@Component({
  selector: 'app-manage-clients-add',
  templateUrl: './manage-clients-add.component.html',
  styleUrls: ['./manage-clients-add.component.css']
})
export class ManageClientsAddComponent implements OnInit {

  newClientName: String;
  newClientEmail: String;
  newClientTelephone: String;

  constructor(private snackBar: MatSnackBar, private projectSatusService: ProjectstatusService) { }

  ngOnInit(): void {
  }

  addClient() {
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
    this.projectSatusService.addClient(this.newClientName, this.newClientEmail, this.newClientTelephone).subscribe(() => {
      this.snackBar.open($localize`Client was added.`, "OK", { duration: 4000 });
    }, (err) => { this.snackBar.open($localize`Error! Client could not be added`, "OK", { duration: 4000 }); console.log(err); });
  }

}
