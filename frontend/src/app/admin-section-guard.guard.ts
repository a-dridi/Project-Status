import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectstatusService } from './projectstatus.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSectionGuardGuard implements CanActivate {
  projectStatusService: ProjectstatusService;

  constructor(projectStatusService: ProjectstatusService, private router: Router) {
    this.projectStatusService = projectStatusService;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.projectStatusService.checkAdminAuthentication().toPromise().then((data) => {
      return true;
    }).catch((err) => {
      this.router.navigate(['/admin-login']);
      return false;
    });
  }
}
