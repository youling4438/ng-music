import {NgModule} from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {ContextStoreModule} from "./context";
import {EffectsModule} from "@ngrx/effects";


@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot({}),
		EffectsModule.forRoot(),
		ContextStoreModule,
	]
})
export class AppStoreModule {
}
