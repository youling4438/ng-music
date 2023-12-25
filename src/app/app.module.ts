import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CoreModule} from "./core.module";
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		CoreModule,
		StoreRouterConnectingModule.forRoot(),
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
