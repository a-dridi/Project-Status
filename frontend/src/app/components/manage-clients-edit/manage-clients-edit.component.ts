import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Client } from 'src/app/client.model';
import { MatDialog } from '@angular/material/dialog';
import { EditClientDialogComponent } from '../edit-client-dialog/edit-client-dialog.component';

@Component({
  selector: 'app-manage-clients-edit',
  templateUrl: './manage-clients-edit.component.html',
  styleUrls: ['./manage-clients-edit.component.css']
})
export class ManageClientsEditComponent implements OnInit {

  clientsCreated: boolean = true;
  clients: Client[];

  constructor(private snackBar: MatSnackBar, private projectSatusService: ProjectstatusService, private editClientDialog: MatDialog) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.projectSatusService.getAllClients().subscribe((clients: Client[]) => {
      if (clients.length < 1) {
        this.clientsCreated = false;
      }
      this.clients = clients;
    });
  }

  editClient(id, name, email, telephone) {
    const editClientDialogRef = this.editClientDialog.open(EditClientDialogComponent, {
      width: '400px',
      data: { id: id, name: name, email: email, telephone: telephone }
    });

    editClientDialogRef.afterClosed().subscribe(result => {
      this.loadClients();
    });
  }

}
