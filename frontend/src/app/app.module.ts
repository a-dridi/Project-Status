import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatusComponent } from './components/status/status.component';
import { DefaultComponent } from './components/default/default.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import '@angular/localize/init';
import { AdminRegistrationComponent } from './components/admin-registration/admin-registration.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLogoutComponent } from './components/admin-logout/admin-logout.component';
import { AdminCreateComponent } from './components/admin-create/admin-create.component';
import { AdminEditComponent } from './components/admin-edit/admin-edit.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';

import { ProjectstatusService } from './projectstatus.service';
import { AdminDataSharingService } from './admindatasharingservice';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { ManageClientsComponent } from './components/manage-clients/manage-clients.component';
import { ManageClientsAddComponent } from './components/manage-clients-add/manage-clients-add.component';
import { ManageClientsEditComponent } from './components/manage-clients-edit/manage-clients-edit.component';
import { EditClientDialogComponent } from './components/edit-client-dialog/edit-client-dialog.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusComponent,
    DefaultComponent,
    AdminLoginComponent,
    AdminRegistrationComponent,
    AdminComponent,
    AdminLogoutComponent,
    AdminCreateComponent,
    AdminEditComponent,
    ManageClientsComponent,
    ManageClientsAddComponent,
    ManageClientsEditComponent,
    EditClientDialogComponent,
    LegalNoticeComponent,
    PrivacyPolicyComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule
  ],
  providers: [ProjectstatusService, { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, AdminDataSharingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
