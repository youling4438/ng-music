import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {User} from "../apis/types";

@Injectable({
	providedIn: 'root'
})
export class ContextService {
	private user$ = new Subject<User>();
	constructor() {
	}

	getUser() :Observable<User> {
		return this.user$.asObservable();
	}
	setUser(user: User) :void {
		this.user$.next(user);
	}
}
