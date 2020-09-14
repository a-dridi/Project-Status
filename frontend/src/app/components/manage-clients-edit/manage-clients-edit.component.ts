import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectstatusService } from 'src/app/projectstatus.service';
import { Client } from 'src/app/client.model';
import { MatDialog } from '@angular/material/dialog';
import { EditClientDialogComponent } from '../edit-client-dialog/edit-client-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Languages } from 'src/app/util/languages';

@Component({
  selector: 'app-manage-clients-edit',
  templateUrl: './manage-clients-edit.component.html',
  styleUrls: ['./manage-clients-edit.component.css']
})
export class ManageClientsEditComponent implements OnInit {

  clientsCreated: boolean = true;
  clients: Client[];
  clientsSorted: Client[];
  clientsDataSource;
  @ViewChild(MatSort) sort: MatSort;
  clientsColumns = ['clientname', 'clientemail', 'clienttelephone', 'delete'];
  placeholderFilterClients: string = $localize`Search Clients`;
  languages = Languages.getLanguages();

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
      this.clientsDataSource = new MatTableDataSource(this.clientsSorted);
      this.clientsDataSource.sort = this.sort;
    });
  }

  /**
   * Opens edit dialog with the passed values in the argument
   * @param id 
   * @param name 
   * @param email 
   * @param telephone 
   * @param languagecode 
   */
  editClient(id, name, email, telephone, languagecode, notificationmethod) {
    let selectedlanguage = this.languages.filter(language => { return (language.code === languagecode) })[0];
    const editClientDialogRef = this.editClientDialog.open(EditClientDialogComponent, {
      width: '400px',
      data: { id: id, name: name, email: email, telephone: telephone, languagecode: languagecode, selectedlanguage: selectedlanguage, notificationmethod: notificationmethod}
    });

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
        case 'clientnamesort': return this.compareTableValue(a.name.toLowerCase(), b.name.toLowerCase(), isAscending);
        default: return 0;
      }
    });
  }

  compareTableValue(a: number | string, b: number | string, isAscending) {
    return (a < b ? -1 : 1) * (isAscending ? 1 : -1);
  }

  filterClients(filterValue: string) {
    this.clientsDataSource.filter = filterValue.trim().toLowerCase();
  }


}
