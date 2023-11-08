import {NgModule} from '@angular/core';
import {AlbumRoutingModule} from './album-routing.module';
import {AlbumComponent} from './album.component';
import {DirectivesModule} from "../../share/directives/directives.module";
import {TagModule} from "../../share/components/tag/tag.module";


@NgModule({
	declarations: [
		AlbumComponent,
	],
	imports: [
		AlbumRoutingModule,
		TagModule,
		DirectivesModule,
	]
})
export class AlbumModule {
}
