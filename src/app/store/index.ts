import {NgModule} from '@angular/core';
import {META_REDUCERS, StoreModule} from "@ngrx/store";
import {ContextStoreModule} from "./context";
import {EffectsModule} from "@ngrx/effects";
import {metaReducerFactory} from "./config";


@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot({}, ),
		EffectsModule.forRoot(),
		ContextStoreModule,
	],
	providers: [
		{
			provide: META_REDUCERS,
			useFactory: metaReducerFactory,
			multi: true,
		}
	],
})
export class AppStoreModule {
}
