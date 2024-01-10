import {NgModule} from '@angular/core';

import {MovieRoutingModule} from './movie-routing.module';
import {MovieComponent} from "./movie.component";
import {DirectivesModule} from "../../share/directives/directives.module";
import {NgForOf} from "@angular/common";
import {PushPipe} from "@ngrx/component";


@NgModule({
	declarations: [
		MovieComponent
	],
    imports: [
        DirectivesModule,
        MovieRoutingModule,
        NgForOf,
        PushPipe,
    ]
})
export class MovieModule {
}
