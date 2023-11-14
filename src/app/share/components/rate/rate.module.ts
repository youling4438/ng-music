import {NgModule} from '@angular/core';
import {RateItemComponent} from './rate-item/rate-item.component';
import {DirectivesModule} from "../../directives/directives.module";
import {RateComponent} from './rate.component';

@NgModule({
	declarations: [
		RateItemComponent,
		RateComponent
	],
	exports: [
		RateComponent,
	],
	imports: [
		DirectivesModule
	]
})
export class RateModule {
}
