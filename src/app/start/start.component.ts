import { LoginData, WorkspaceData } from '../app.interfaces';
import { BackendService } from '../backend.service';
import { MainDataService } from '../maindata.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServerError } from 'iqb-components';


@Component({
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {
  adminloginform: FormGroup;
  private loginDataSubscription: Subscription = null;
  public showLogin = true;

  constructor(private fb: FormBuilder,
    private mds: MainDataService,
    private bs: BackendService,
    private router: Router) { }

  ngOnInit() {
    this.adminloginform = this.fb.group({
      testname: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      testpw: this.fb.control('', [Validators.required, Validators.minLength(3)])
    });
    this.loginDataSubscription = this.mds.loginData$.subscribe(logindata => {
      this.showLogin = logindata.adminToken.length === 0;
    });
  }

  login() {
    if (this.adminloginform.valid) {
      this.bs.login(
        this.adminloginform.get('testname').value, this.adminloginform.get('testpw').value
      ).subscribe(admindata => {
        if (admindata instanceof ServerError) {
          this.mds.setNewLoginData();
          this.mds.setNewErrorMsg(admindata as ServerError);
        } else {
          this.mds.setNewLoginData(admindata as LoginData);
          this.mds.setNewErrorMsg();
        }
      });
    }
  }

  buttonGotoWorkspace(ws: WorkspaceData) {
    if (ws.role === 'MO') {
      this.router.navigateByUrl('/ws/' + ws.id.toString() + '/monitor');
    } else {
      this.router.navigateByUrl('/ws/' + ws.id.toString() + '/files');
    }
  }

  ngOnDestroy() {
    if (this.loginDataSubscription !== null) {
      this.loginDataSubscription.unsubscribe();
    }
  }
}
