import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {CategoryFeatureKey, categoryReducer} from "./reducer";
import {CategoryEffects} from "./category.effects";

@NgModule({
	imports: [
		StoreModule.forFeature(CategoryFeatureKey, categoryReducer),
		EffectsModule.forFeature([CategoryEffects]),
	],
})
export class CategoryStoreModule {
}
