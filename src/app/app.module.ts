import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CoreModule} from "./core.module";
import {LetDirective, PushPipe} from "@ngrx/component";
import {BrowserModule} from "@angular/platform-browser";

// import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		CoreModule,
		LetDirective,
		PushPipe,
		BrowserModule,
		// StoreRouterConnectingModule.forRoot(),
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
