import {NgModule} from '@angular/core';
import {AlbumRoutingModule} from './album-routing.module';
import {AlbumComponent} from './album.component';
import {DirectivesModule} from "../../share/directives/directives.module";
import {TagModule} from "../../share/components/tag/tag.module";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {PipesModule} from "../../share/pipes/pipes.module";
import {SizeComponent} from './size/size.component';
import {FormsModule} from "@angular/forms";
import {CheckboxModule} from "../../share/components/checkbox/checkbox.module";
import {PaginationModule} from "../../share/components/pagination/pagination.module";


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
        CheckboxModule,
        FormsModule,
        JsonPipe,
        PaginationModule,
    ]
})
export class AlbumModule {
}
