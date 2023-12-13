import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../apis/types";
import {select, Store} from "@ngrx/store";
import {ContextStoreModule} from "../../store/context";
import {ContextState} from "../../store/context/reducer";
import {getUser, selectContextFeature} from "../../store/context/selectors";
import {setUser} from "../../store/context/action";

@Injectable({
	providedIn: 'root'
})
export class ContextStoreService {
	private context$ : Observable<ContextState>;
	constructor(
		private store$: Store<ContextStoreModule>,
	) {
		this.context$ = this.store$.select(selectContextFeature);
	}

	getUser() :Observable<User> {
		return this.context$.pipe(select(getUser));
	}
	setUser(user: User) :void {
		this.store$.dispatch(setUser(user));
	}
}
