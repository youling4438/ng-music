import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {ContextFeatureKey, contextReducerFunc} from "./reducer";
import {EffectsModule} from "@ngrx/effects";
import {UserEffects} from "./user.effects";

@NgModule({
	imports: [
		StoreModule.forFeature(ContextFeatureKey, contextReducerFunc),
		EffectsModule.forFeature([UserEffects]),
	]
})
export class ContextStoreModule {
}
