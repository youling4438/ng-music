import {NgModule} from '@angular/core';
import {PaginationComponent} from './pagination.component';
import {DirectivesModule} from "../../directives/directives.module";


@NgModule({
	declarations: [
		PaginationComponent
	],
	imports: [DirectivesModule],
	exports: [PaginationComponent],
})
export class PaginationModule {
}
