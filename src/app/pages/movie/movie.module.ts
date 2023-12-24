import {NgModule} from '@angular/core';

import {MovieRoutingModule} from './movie-routing.module';
import {MovieComponent} from "./movie.component";
import {DirectivesModule} from "../../share/directives/directives.module";
import {AsyncPipe, NgForOf} from "@angular/common";


@NgModule({
	declarations: [
		MovieComponent
	],
	imports: [
		DirectivesModule,
		MovieRoutingModule,
		AsyncPipe,
		NgForOf,
	]
})
export class MovieModule {
}
