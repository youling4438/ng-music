import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {ContextFeatureKey, contextReducerFunc} from "./reducer";

@NgModule({
	imports: [
		StoreModule.forFeature(ContextFeatureKey, contextReducerFunc),
	]
})
export class ContextStoreModule {
}
