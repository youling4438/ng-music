import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Base, User} from "./types";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HeaderKeys} from "../../share/config";

export interface LoginRes {
	user: User;
	token: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private prefix = '/xmly/';
	private needTokenHeader = {
		headers: new HttpHeaders().set(HeaderKeys.needToken, 'true'),
	}

	constructor(private http: HttpClient) {
	}

	login(args: Exclude<User, 'name'>): Observable<LoginRes> {
		return this.http
			.post(`${environment.baseUrl}${this.prefix}login`, args)
			.pipe(map((res: Base<LoginRes>) => res.data));
	}

	// 获取用户信息
	userInfo(): Observable<LoginRes> {
		return this.http
			.get(`${environment.baseUrl}${this.prefix}account`, this.needTokenHeader)
			.pipe(map((res: Base<LoginRes>) => res.data));
	}

	logout(): Observable<void> {
		return this.http
			.get(`${environment.baseUrl}${this.prefix}logout`, this.needTokenHeader)
			.pipe(map((res: Base<void>) => res.data));
	}
}
