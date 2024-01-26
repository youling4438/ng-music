import {NgModule} from '@angular/core';
import {ExpandRoutingModule} from "./expand-routing.module";
import {ExpandComponent} from "./expand.component";
import {DirectivesModule} from "../../share/directives/directives.module";


@NgModule({
	declarations: [
		ExpandComponent,
	],
	imports: [
		ExpandRoutingModule,
		DirectivesModule,
	]
})
export class ExpandModule {
}
