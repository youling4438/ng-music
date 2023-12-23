import {NgModule} from '@angular/core';

import {BookRoutingModule} from './book-routing.module';
import {BookComponent} from "./book.component";
import {DirectivesModule} from "../../share/directives/directives.module";
import {AsyncPipe, NgForOf} from "@angular/common";


@NgModule({
	declarations: [
		BookComponent
	],
	imports: [
		BookRoutingModule,
		DirectivesModule,
		AsyncPipe,
		NgForOf
	]
})
export class BookModule {
}
