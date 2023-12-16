import {NgModule} from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {ContextStoreModule} from "./context";
import {EffectsModule} from "@ngrx/effects";
import {metaReducers} from "./config";


@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot({}, {
			metaReducers,
		}),
		EffectsModule.forRoot(),
		ContextStoreModule,
	]
})
export class AppStoreModule {
}
