import {ActionReducer, MetaReducer} from '@ngrx/store';

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}

export function metaReducerFactory(): MetaReducer<any> {
    return debug;
}


export const metaReducers: MetaReducer<any>[] = [debug];
export const runtimeChecks = {
    strictStateImmutability: false,
    strictActionImmutability: false,
    strictStateSerializability: true,
    strictActionSerializability: true,
    strictActionWithinNgZone: true,
    strictActionTypeUniqueness: true,
};
