import { GetFileResponseData, CheckWorkspaceResponseData, BookletsStarted, SysCheckStatistics,
  ReviewData, LogData, UnitResponse, ResultData, MonitorData } from './workspace.interfaces';
import {Injectable, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {WorkspaceDataService} from './workspacedata.service';
import {MainDataService} from '../maindata.service';
import { ErrorHandler, ServerError } from 'iqb-components';

@Injectable()

export class BackendService {
  private serverUrlSlim = '';
  private serverUrlSysCheck = '';

  constructor(
    @Inject('SERVER_URL') private readonly serverUrl: string,
    private http: HttpClient,
    private wds: WorkspaceDataService,
    private mds: MainDataService) {

    this.serverUrlSlim = this.serverUrl + 'php/ws.php/';
    this.serverUrlSysCheck = this.serverUrl + 'php_admin/';
  }


  getFiles(workspaceId: number): Observable<GetFileResponseData[] | ServerError> {

    return this.http
      .get<GetFileResponseData[]>(this.serverUrl + `workspace/${workspaceId}/files`)
      .pipe(catchError(ErrorHandler.handle));
  }

  deleteFiles(workspaceId: number, filesToDelete: Array<string>): Observable<FileDeletionReport | ServerError> {

    return this.http
      .request<FileDeletionReport>('delete', this.serverUrl + `workspace/${workspaceId}/files`, {body: {f: filesToDelete}})
      .pipe(catchError(ErrorHandler.handle));
  }

  checkWorkspace(workspaceId: number): Observable<CheckWorkspaceResponseData | ServerError> {

    return this.http
      .get<CheckWorkspaceResponseData>(this.serverUrl + `workspace/${workspaceId}/validation`, {})
      .pipe(catchError(ErrorHandler.handle));
  }

  getBookletsStarted(workspaceId: number, groups: string[]): Observable<BookletsStarted[] | ServerError> {

    return this.http
      .post<BookletsStarted[]>(this.serverUrl + `workspace/${workspaceId}/booklets/started`, {groups: groups})
      .pipe(catchError(ErrorHandler.handle));
  }

  lockBooklets(workspaceId: number, groups: string[]): Observable<boolean | ServerError> {

    return this.http
      .post<boolean>(this.serverUrl + `workspace/${workspaceId}/lock`, {groups: groups})
      .pipe(catchError(ErrorHandler.handle));
  }

  unlockBooklets(workspaceId: number, groups: string[]): Observable<boolean | ServerError> {
    return this.http
      .post<boolean>(this.serverUrl + `workspace/${workspaceId}/unlock`, {groups: groups})
      .pipe(catchError(ErrorHandler.handle));
}

  getMonitorData(workspaceId: number): Observable<MonitorData[] | ServerError> {
    return this.http
      .get<MonitorData[]>(this.serverUrl + `workspace/${workspaceId}/status`, {})
        .pipe(
          catchError(ErrorHandler.handle)
        );
}

  getResultData(workspaceId: number): Observable<ResultData[]> {
    return this.http
      .get<ResultData[]>(this.serverUrl + `workspace/${workspaceId}/results`, {})
        .pipe(
          catchError(() => [])
        );
  }

  getResponses(workspaceId: number, groups: string[]): Observable<UnitResponse[]> {

    return this.http
      .get<UnitResponse[]>(this.serverUrl + `workspace/${workspaceId}responses`, {params: {groups: groups.join(',')}})
      .pipe(catchError(() => []));
  }

  getLogs(workspaceId: number, groups: string[]): Observable<LogData[]> {

    return this.http
      .get<LogData[]>(this.serverUrl + `workspace/${workspaceId}logs`, {params: {groups: groups.join(',')}})
      .pipe(catchError(() => []));
  }

  getReviews(workspaceId: number, groups: string[]): Observable<ReviewData[]> {

    return this.http
      .get<ReviewData[]>(this.serverUrl + `workspace/${workspaceId}/reviews`, {params: {groups: groups.join(',')}})
      .pipe(catchError(() => []));
  }

  deleteData(workspaceId: number, groups: string[]): Observable<boolean | ServerError> {

    return this.http
      .request<boolean>('delete', this.serverUrl + `workspace/${workspaceId}/responses`, {body: {groups: groups}})
      .pipe(catchError(ErrorHandler.handle));
  }

  getSysCheckReportList(): Observable<SysCheckStatistics[] | ServerError> {
    const loginData = this.mds.loginData$.getValue();
    return this.http
      .post<SysCheckStatistics[]>(this.serverUrlSysCheck + 'getSysCheckReportList.php',
        {ws: this.wds.workspaceId$.getValue(), at: loginData.admintoken})
        .pipe(
          catchError(ErrorHandler.handle)
        );
  }

  getSysCheckReport(reports: string[], columnDelimiter: string,
                    quoteChar: string): Observable<string[] | ServerError> {
    const loginData = this.mds.loginData$.getValue();
    return this.http
      .post<string[]>(this.serverUrlSysCheck + 'getSysCheckReport.php',
        {r: reports, cd: columnDelimiter, q: quoteChar, ws: this.wds.workspaceId$.getValue(), at: loginData.admintoken})
          .pipe(
            catchError(ErrorHandler.handle)
          );
  }

  deleteSysCheckReports(reports: string[]): Observable<boolean | ServerError> {
    const loginData = this.mds.loginData$.getValue();
    return this.http
      .post<boolean>(this.serverUrlSysCheck + 'deleteSysCheckReports.php',
        {r: reports, ws: this.wds.workspaceId$.getValue(), at: loginData.admintoken})
          .pipe(
            catchError(ErrorHandler.handle)
          );
  }
}

export interface FileDeletionReport {
  deleted: string[];
  not_allowed: string[];
  did_not_exist: string[];
}
