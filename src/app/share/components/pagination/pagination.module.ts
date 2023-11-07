import {NgModule} from '@angular/core';
import {PaginationComponent} from './pagination.component';
import {DirectivesModule} from "../../directives/directives.module";
import {NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";


@NgModule({
	declarations: [
		PaginationComponent
	],
	imports: [DirectivesModule, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault],
	exports: [PaginationComponent],
})
export class PaginationModule {
}
