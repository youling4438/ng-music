import {NgModule} from '@angular/core';
import {BackTopComponent} from './back-top.component';
import {NgIf, NgTemplateOutlet} from "@angular/common";


@NgModule({
	declarations: [
		BackTopComponent
	],
	imports: [
		NgIf,
		NgTemplateOutlet
	],
	exports: [
		BackTopComponent,
	]
})
export class BackTopModule {
}
