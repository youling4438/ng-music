import {createAction, props} from '@ngrx/store';
import {User} from 'src/app/services/apis/types';
import {LoginRes} from "../../services/apis/user.service";

export const login = createAction(
	'[Context] Login',
	props<Exclude<User, 'name'>>()
);

export const loginSuccess = createAction(
	'[Context] Login success',
	props<LoginRes>()
);

export const getUserInfo = createAction(
	'[Context] Get user info',
	props<LoginRes>()
);

export const logout = createAction('[Context] Logout');

export const setUser = createAction(
	'[Context] Set user',
	props<User>()
);
