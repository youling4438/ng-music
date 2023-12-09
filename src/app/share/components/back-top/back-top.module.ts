import {NgModule} from '@angular/core';
import {BackTopComponent} from './back-top.component';
import {NgIf} from "@angular/common";


@NgModule({
	declarations: [
		BackTopComponent
	],
	imports: [
		NgIf
	],
	exports: [
		BackTopComponent,
	]
})
export class BackTopModule {
}
