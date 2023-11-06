import {NgModule} from '@angular/core';
import {AlbumsRoutingModule} from './albums-routing.module';
import {AlbumsComponent} from './albums.component';
import {CommonModule} from "@angular/common";
import {DirectivesModule} from "../../share/directives/directives.module";
import {PipesModule} from "../../share/pipes/pipes.module";
import {TagModule} from "../../share/components/tag/tag.module";

@NgModule({
	declarations: [
		AlbumsComponent
	],
	imports: [
		CommonModule,
		DirectivesModule,
		AlbumsRoutingModule,
		PipesModule,
		TagModule,
	]
})

export class AlbumsModule {
}
