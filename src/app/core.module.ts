import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {HeaderComponent} from './layouts/header/header.component';
import {BreadcrumbModule} from "./share/components/breadcrumb/breadcrumb.module";
import {ShareModule} from "./share/share.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {PagesModule} from "./pages/pages.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from './layouts/login/login.component';
import {DirectivesModule} from "./share/directives/directives.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "./share/components/checkbox/checkbox.module";
import {InterceptorService} from "./services/apis/interceptor.service";
import {MessageModule} from "./share/components/message/message.module";
import {PlayerComponent} from './layouts/player/player.component';
import {PipesModule} from "./share/pipes/pipes.module";


@NgModule({
	declarations: [
		HeaderComponent,
		LoginComponent,
		PlayerComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		PagesModule,
		AppRoutingModule,
		BreadcrumbModule,
		ShareModule,
		BrowserAnimationsModule,
		CheckboxModule,
		DirectivesModule,
		ReactiveFormsModule,
		FormsModule,
		MessageModule,
		PipesModule,
	],
	exports: [
		HeaderComponent,
		BreadcrumbModule,
		BrowserModule,
		AppRoutingModule,
		LoginComponent,
		PlayerComponent,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptorService,
			multi: true,
		}
	],
})
export class CoreModule {
	constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error('CoreModule只能被AppModule引入');
		}
	}
}
