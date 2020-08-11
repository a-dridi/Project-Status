import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusComponent } from './components/status/status.component';
import { DefaultComponent } from './components/default/default.component';
import { AdminRegistrationComponent } from './components/admin-registration/admin-registration.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminLogoutComponent } from './components/admin-logout/admin-logout.component';
import { AdminEditComponent } from './components/admin-edit/admin-edit.component';
import { AdminCreateComponent } from './components/admin-create/admin-create.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminSectionGuardGuard } from './admin-section-guard.guard';

const routes: Routes = [
  { path: 'status/:email/:projectid', component: StatusComponent },
  { path: 'index', component: DefaultComponent },
  { path: 'admin-registration', component: AdminRegistrationComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-logout', component: AdminLogoutComponent },
  { path: 'admin-edit/:projectid', component: AdminEditComponent, canActivate: [AdminSectionGuardGuard] },
  { path: 'admin-create', component: AdminCreateComponent, canActivate: [AdminSectionGuardGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminSectionGuardGuard] },

  { path: '', redirectTo: 'index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
