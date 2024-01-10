import {NgModule} from '@angular/core';

import {BookRoutingModule} from './book-routing.module';
import {BookComponent} from "./book.component";
import {DirectivesModule} from "../../share/directives/directives.module";
import {NgForOf} from "@angular/common";
import {LetDirective, PushPipe} from "@ngrx/component";


@NgModule({
	declarations: [
		BookComponent
	],
	imports: [
		BookRoutingModule,
		DirectivesModule,
		NgForOf,
		PushPipe,
		LetDirective
	]
})
export class BookModule {
}
