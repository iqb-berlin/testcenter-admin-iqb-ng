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
      .get<CheckWorkspaceResponseData>(this.serverUrl + `/workspace/${workspaceId}/validation`, {})
      .pipe(catchError(ErrorHandler.handle));
  }

  getBookletsStarted(groups: string[]): Observable<BookletsStarted[] | ServerError> {
    return this.http
      .post<BookletsStarted[]>(this.serverUrl + 'getBookletsStarted.php', {g: groups})
        .pipe(
          catchError(ErrorHandler.handle)
        );
  }

  lockBooklets(groups: string[]): Observable<boolean | ServerError> {
    return this.http
      .post<boolean>(this.serverUrlSlim + 'lock', {g: groups})
        .pipe(
          catchError(ErrorHandler.handle)
        );
  }

  unlockBooklets(groups: string[]): Observable<boolean | ServerError> {
    return this.http
      .post<boolean>(this.serverUrlSlim + 'unlock', {g: groups})
        .pipe(
            catchError(ErrorHandler.handle)
          );
}

  getMonitorData(): Observable<MonitorData[] | ServerError> {
    return this.http
      .post<MonitorData[]>(this.serverUrl + 'getMonitorData.php', {})
        .pipe(
          catchError(ErrorHandler.handle)
        );
}

  getResultData(): Observable<ResultData[]> {
    return this.http
      .post<ResultData[]>(this.serverUrl + 'getResultData.php', {})
        .pipe(
          catchError(() => [])
        );
  }

  getResponses(groups: string[]): Observable<UnitResponse[]> {
    return this.http
      .post<UnitResponse[]>(this.serverUrl + 'getResponses.php', {g: groups})
        .pipe(
          catchError(() => [])
        );
  }

  getLogs(groups: string[]): Observable<LogData[]> {
    return this.http
      .post<LogData[]>(this.serverUrl + 'getLogs.php', {g: groups})
        .pipe(
          catchError(() => [])
        );
  }

  getReviews(groups: string[]): Observable<ReviewData[]> {
    return this.http
      .post<ReviewData[]>(this.serverUrl + 'getReviews.php', {g: groups})
        .pipe(
          catchError(() => [])
        );
  }

  deleteData(groups: string[]): Observable<boolean | ServerError> {
    return this.http
      .post<boolean>(this.serverUrl + 'deleteData.php', {g: groups})
        .pipe(
          catchError(ErrorHandler.handle)
        );
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
