import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Client } from 'src/app/client.model';
import { MatDialog } from '@angular/material/dialog';
import { EditClientDialogComponent } from '../edit-client-dialog/edit-client-dialog.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-clients-edit',
  templateUrl: './manage-clients-edit.component.html',
  styleUrls: ['./manage-clients-edit.component.css']
})
export class ManageClientsEditComponent implements OnInit {

  clientsCreated: boolean = true;
  clients: Client[];
  clientsSorted: Client[];
  clientsColumns = ['clientname', 'clientemail', 'clienttelephone', 'delete'];

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
      this.clientsSorted = clients;
    });
  }

  editClient(id, name, email, telephone) {
    const editClientDialogRef = this.editClientDialog.open(EditClientDialogComponent, {
      width: '400px',
      data: { id: id, name: name, email: email, telephone: telephone }
    });
    console.log("name edit:" + name)

    editClientDialogRef.afterClosed().subscribe(result => {
      this.loadClients();
    });
  }

  deleteClient(id) {
    this.projectSatusService.deleteClientById(id).subscribe(() => {
      this.snackBar.open($localize`Project was deleted. `, "OK", { duration: 4000 });
      this.loadClients();
    }, (err) => {
      this.snackBar.open($localize`ERROR. Project could not be deleted. `, "OK", { duration: 4000 });
      console.log(err);
    });
  }

  sortProjectsTable(sort: Sort) {
    //Restore normal sort order
    if (!sort.active || sort.direction === '') {
      this.clientsSorted = this.clients.slice();
      return;
    }

    this.clientsSorted = this.clients.sort((a, b) => {
      const isAscending = sort.direction === 'asc';
      switch (sort.active) {
        case 'clientnamesort': return this.compareTableValue(a.name, b.name, isAscending);
        default: return 0;
      }
    });
  }

  compareTableValue(a: number | string, b: number | string, isAscending) {
    return (a < b ? -1 : 1) * (isAscending ? 1 : -1);
  }


}
