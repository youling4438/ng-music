import {NgModule} from '@angular/core';
import {META_REDUCERS, StoreModule} from "@ngrx/store";
import {ContextStoreModule} from "./context";
import {EffectsModule} from "@ngrx/effects";
import {metaReducerFactory, runtimeChecks} from "./config";
import {environment} from "../../environments/environment";
import {BookStoreModule} from "./book";
@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot({},{
			runtimeChecks,
		}),
		EffectsModule.forRoot(),
		ContextStoreModule,
		BookStoreModule,
		environment.imports,
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
