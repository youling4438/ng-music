import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {HeaderComponent} from './layouts/header/header.component';
import {BreadcrumbModule} from "./share/components/breadcrumb/breadcrumb.module";
import {ShareModule} from "./share/share.module";
import {HttpClientModule} from "@angular/common/http";
import {PagesModule} from "./pages/pages.module";


@NgModule({
	declarations: [
		HeaderComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		PagesModule,
		AppRoutingModule,
		BreadcrumbModule,
		ShareModule,
	],
	exports: [
		HeaderComponent,
		BreadcrumbModule,
		BrowserModule,
		AppRoutingModule,
	]
})
export class CoreModule {
	constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error('CoreModule只能被AppModule引入');
		}
	}
}
