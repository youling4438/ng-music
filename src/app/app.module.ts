import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CoreModule} from "./core.module";
import {DirectivesModule} from "./share/directives/directives.module";

@NgModule({
	declarations: [
		AppComponent,
	],
    imports: [
        CoreModule,
        DirectivesModule,
    ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
