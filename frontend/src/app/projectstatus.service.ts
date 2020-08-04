import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectstatusService {

  API_URL = "http://localhost:4000/api"
  adminName: String = "";

  constructor(private httpClient: HttpClient) {

  }

  getAllProjects() {
    return this.httpClient.get(`${this.API_URL}/projects`);
  }

  getProjectById(id) {
    return this.httpClient.get(`${this.API_URL}/project/${id}`);
  }

  getProjectByIdAndEmail(id, email) {
    console.log("id proj");
    console.log(id);
    console.log("email proj");
    console.log(email);

    return this.httpClient.get(`${this.API_URL}/project/customer/${id}/${email}`);
  }

  addProject(createdDate, title, description, clientEmail, endDate) {
    const newProject = {
      title: title,
      created_date: createdDate,
      description: description,
      client_email: clientEmail,
      end_date: endDate,
      finished: false
    };
    return this.httpClient.post(`${this.API_URL}/project/add`, newProject);
  }

  updateProject(id, createdDate, title, description, clientEmail, endDate, projectFinished) {
    const updatedProject = {
      title: title,
      created_date: createdDate,
      description: description,
      client_email: clientEmail,
      end_date: endDate,
      finished: projectFinished
    };
    return this.httpClient.post(`${this.API_URL}/project/update/${id}`, updatedProject);
  }

  deleteAllProject() {
    return this.httpClient.get(`${this.API_URL}/projects/deleteall`);
  }

  deleteProjectById(id) {
    return this.httpClient.get(`${this.API_URL}/project/delete/${id}`);
  }

  getProjectStages() {
    return this.httpClient.get(`${this.API_URL}/projectstages`);
  }

  getProjectStagesById(id) {
    return this.httpClient.get(`${this.API_URL}/projectstage/${id}`);
  }

  getProjectStagesByProjectObjectId(objectid) {
    return this.httpClient.get(`${this.API_URL}/projectstages/project_id/${objectid}`);
  }

  addProjectStage(stageNumber, title, description, finished, projectId) {
    const newProjectStage = {
      stage_number: stageNumber,
      title: title,
      description: description,
      finished: finished,
      project_id: projectId
    };
    return this.httpClient.post(`${this.API_URL}/projectstage/add`, newProjectStage);

  }

  updateProjectStageById(id, stageNumber, title, description, finished, projectId) {
    const updatedProject = {
      stage_number: stageNumber,
      title: title,
      description: description,
      finished: finished,
      project_id: projectId
    };
    return this.httpClient.post(`${this.API_URL}/projectstage/update/${id}`, updatedProject);

  }


  deleteAllProjectStages() {
    return this.httpClient.get(`${this.API_URL}/projectstages/deleteall`);
  }

  deleteProjectStageById(id) {
    return this.httpClient.get(`${this.API_URL}/projectstage/delete/${id}`);
  }

  getAdminAccount() {
    return this.httpClient.get(`${this.API_URL}/adminaccounts`);
  }

  //Check if admin user is authenticated to allow loading of admin section
  checkAdminAuthentication() {
    //return this.http.get(`${this.uri}/admin`);
    return this.httpClient.get(`${this.API_URL}/admin`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }

  doAdminLogin(body: any) {
    return this.httpClient.post(`${this.API_URL}/admin-login`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }


  doAdminLogout() {
    return this.httpClient.get(`${this.API_URL}/admin-logout`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  doAdminRegistration(email, password, name, telephone, note) {
    const adminaccount = {
      email: email,
      password: password,
      name: name,
      telephone: telephone,
      note: note
    };
    return this.httpClient.post(`${this.API_URL}/admin-registration`, adminaccount);
  }

  sendEmailNotificationClient(clientEmail, emailSubject, emailText, adminaccountName, adminaccountEmail) {
    const email = {
      client_email: clientEmail,
      email_subject: emailSubject,
      email_text: emailText,
      adminaccount_name: adminaccountName,
      adminaccount_email: adminaccountEmail
    };
    return this.httpClient.post(`${this.API_URL}/email/client/notification`, email);
  }

  getAuthenticatedAdminAccount() {
    return this.httpClient.get(`${this.API_URL}/get/authenticated-adminaccount`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}


