import {User} from "../../services/apis/types";
import {Action, createReducer, on} from "@ngrx/store";
import {loginSuccess, logoutSuccess, setUser} from "./action";
import {LoginRes} from "../../services/apis/user.service";

export const ContextFeatureKey = 'context';
export interface ContextState {
	user: User;
	token: string;
}

export const initialState: ContextState = {
	user: null,
	token: '',
};

const reducer = createReducer(
	initialState,
	on(setUser, (state: ContextState, user: User) => ({...state, user,})),
	on(loginSuccess, (_state: ContextState, {user, token}: LoginRes) => ({user, token})),
	on(logoutSuccess, (_state: ContextState) => ({user: null, token: '',})),
);

export function contextReducerFunc(state: ContextState, action: Action): ContextState {
	return reducer(state, action);
}
