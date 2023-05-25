import {NgModule} from '@angular/core';
import {AlbumsRoutingModule} from './albums-routing.module';
import {AlbumsComponent} from './albums.component';
import {CommonModule} from "@angular/common";

@NgModule({
	declarations: [
		AlbumsComponent
	],
	imports: [
		CommonModule,
		AlbumsRoutingModule
	]
})

export class AlbumsModule {
}
