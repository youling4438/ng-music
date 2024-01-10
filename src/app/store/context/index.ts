import {InjectionToken, NgModule} from "@angular/core";
import {Action, ActionReducerMap, StoreModule} from "@ngrx/store";
import {ContextFeatureKey, contextReducerFunc, ContextState} from "./reducer";
import {EffectsModule} from "@ngrx/effects";
import {UserEffects} from "./user.effects";

export const CONTEXT_REDUCER_TOKEN = new InjectionToken<
	ActionReducerMap<ContextState>
>('Context Reducers');

export function getReducers():(state: ContextState, action: Action) => ContextState {
	return contextReducerFunc;
}

@NgModule({
	imports: [
		StoreModule.forFeature(ContextFeatureKey, CONTEXT_REDUCER_TOKEN),
		EffectsModule.forFeature([UserEffects]),
	],
	providers: [
		{
			provide: CONTEXT_REDUCER_TOKEN,
			useFactory: getReducers,
		}
	],
})
export class ContextStoreModule {
}
