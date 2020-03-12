import { BehaviorSubject } from 'rxjs';
import { LoginData } from './app.interfaces';
import { Injectable } from '@angular/core';
import { ServerError } from 'iqb-components';

@Injectable({
  providedIn: 'root'
})
export class MainDataService {
  private static defaultLoginData: LoginData = {
    adminToken: '',
    name: '',
    workspaces: [],
    isSuperadmin: false
  };

  public get adminToken(): string {
    const myLoginData = this.loginData$.getValue();
    if (myLoginData) {
      return myLoginData.adminToken;
    } else {
      return '';
    }
  }


  public loginData$ = new BehaviorSubject<LoginData>(MainDataService.defaultLoginData);
  public globalErrorMsg$ = new BehaviorSubject<ServerError>(null);


  setNewLoginData(logindata?: LoginData) {
    const myLoginData: LoginData = {
      adminToken: MainDataService.defaultLoginData.adminToken,
      name: MainDataService.defaultLoginData.name,
      workspaces: MainDataService.defaultLoginData.workspaces,
      isSuperadmin: MainDataService.defaultLoginData.isSuperadmin
    };

    if (logindata) {
      if (
        (logindata.adminToken.length > 0) &&
        (logindata.name.length > 0)) {
          myLoginData.adminToken = logindata.adminToken;
          myLoginData.name = logindata.name;
          myLoginData.workspaces = logindata.workspaces;
          myLoginData.isSuperadmin = logindata.isSuperadmin;
      }
    }
    this.loginData$.next(myLoginData);
    localStorage.setItem('at', myLoginData.adminToken);
  }

  setNewErrorMsg(err: ServerError = null) {
    this.globalErrorMsg$.next(err);
  }

  getWorkspaceName(ws: number): string {
    let myreturn = '';
    if (ws > 0) {
      const myLoginData = this.loginData$.getValue();
      if ((myLoginData !== null) && (myLoginData.workspaces.length > 0)) {
        for (let i = 0; i < myLoginData.workspaces.length; i++) {
          if (myLoginData.workspaces[i].id === ws) {
            myreturn = myLoginData.workspaces[i].name;
            break;
          }
        }
      }
    }
    return myreturn;
  }

  getWorkspaceRole(ws: number): string {
    let myreturn = '';
    if (ws > 0) {
      const myLoginData = this.loginData$.getValue();
      if ((myLoginData !== null) && (myLoginData.workspaces.length > 0)) {
        for (let i = 0; i < myLoginData.workspaces.length; i++) {
          if (myLoginData.workspaces[i].id === ws) {
            myreturn = myLoginData.workspaces[i].role;
            break;
          }
        }
      }
    }
    return myreturn;
  }
}
