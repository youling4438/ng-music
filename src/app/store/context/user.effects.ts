import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {getUserInfo, login, loginSuccess, logout, logoutSuccess,} from "./action";
import {mergeMap, tap, throwError} from "rxjs";
import {UserService} from "../../services/apis/user.service";
import {catchError, map} from "rxjs/operators";
import {storageKeys} from "../../share/config";
import {WindowService} from "../../services/tools/window.service";
import {MessageService} from "../../share/components/message/message.service";

@Injectable()
export class UserEffects{
	constructor(
		private cation$: Actions,
		private userServe: UserService,
		private winServe: WindowService,
		private messageServe: MessageService,
	) {
	}

	login$ = createEffect(() => this.cation$.pipe(
		ofType(login),
		mergeMap(payload => this.userServe.login(payload)),
		map(res => loginSuccess(res)),
		catchError(error => {
			return throwError(error);
		})
	))

	info$ = createEffect(() => this.cation$.pipe(
		ofType(getUserInfo),
		mergeMap(() => this.userServe.userInfo()),
		map(res => loginSuccess(res)),
		tap(res => {
			this.winServe.setStorage(storageKeys.token, res.token);
		}),
		catchError(error => {
			this.clearStorages();
			return throwError(error);
		})
	))

	logout$ = createEffect(() => this.cation$.pipe(
		ofType(logout),
		mergeMap(() => this.userServe.logout()),
		map(() => logoutSuccess()),
		tap(() => {
			this.clearStorages();
			this.messageServe.success('退出登录成功');
		}),
		catchError(error => {
			return throwError(error);
		})
	))

	private clearStorages() :void {
		this.winServe.removeStorage(storageKeys.remember);
		this.winServe.removeStorage(storageKeys.token);
	}
}
