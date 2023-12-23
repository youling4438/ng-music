import {isDevMode, NgModule} from '@angular/core';
import {META_REDUCERS, StoreModule} from "@ngrx/store";
import {ContextStoreModule} from "./context";
import {EffectsModule} from "@ngrx/effects";
import {metaReducerFactory, runtimeChecks} from "./config";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot({},{
			runtimeChecks,
		}),
		EffectsModule.forRoot(),
		ContextStoreModule,
		StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
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
