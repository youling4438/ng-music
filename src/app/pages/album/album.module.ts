import {NgModule} from '@angular/core';
import {AlbumRoutingModule} from './album-routing.module';
import {AlbumComponent} from './album.component';
import {DirectivesModule} from "../../share/directives/directives.module";
import {TagModule} from "../../share/components/tag/tag.module";
import {NgForOf, NgIf} from "@angular/common";
import {PipesModule} from "../../share/pipes/pipes.module";
import {SizeComponent} from './size/size.component';


@NgModule({
	declarations: [
		AlbumComponent,
		SizeComponent,
	],
	imports: [
		AlbumRoutingModule,
		TagModule,
		DirectivesModule,
		NgIf,
		PipesModule,
		NgForOf,
	]
})
export class AlbumModule {
}
