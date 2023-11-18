import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Base, User} from "./types";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

export interface LoginRes {
	user: User;
	token: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private prefix = '/xmly/';
	constructor(private http: HttpClient) {
	}
	login(args: Exclude<User, 'name'>): Observable<LoginRes> {
		return this.http
			.post(`${environment.baseUrl}${this.prefix}login`, args)
			.pipe(map((res: Base<LoginRes>) => res.data));
	}
}
