import {NgModule} from '@angular/core';
import {AlbumsRoutingModule} from './albums-routing.module';
import {AlbumsComponent} from './albums.component';
import {CommonModule} from "@angular/common";
import {DirectivesModule} from "../../share/directives/directives.module";
import {PipesModule} from "../../share/pipes/pipes.module";

@NgModule({
	declarations: [
		AlbumsComponent
	],
	imports: [
		CommonModule,
		DirectivesModule,
		AlbumsRoutingModule,
		PipesModule,
	]
})

export class AlbumsModule {
}
