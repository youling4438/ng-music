import {NgModule} from '@angular/core';
import {ExpandRoutingModule} from "./expand-routing.module";
import {ExpandComponent} from "./expand.component";
import {DirectivesModule} from "../../share/directives/directives.module";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {VirtualListComponent} from "./components/virtual-list/virtual-list.component";


@NgModule({
	declarations: [
		ExpandComponent,
		VirtualListComponent,
	],
	imports: [
		ExpandRoutingModule,
		DirectivesModule,
		NgIf,
		NgForOf,
		NgTemplateOutlet,
	],
})
export class ExpandModule {
}
