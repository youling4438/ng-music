import {NgModule} from '@angular/core';
import {TagComponent} from './tag.component';
import {DirectivesModule} from "../../directives/directives.module";
import {NgIf} from "@angular/common";


@NgModule({
	declarations: [
		TagComponent,
	],
	imports: [
		DirectivesModule,
		NgIf,
	],
	exports: [
		TagComponent,
	],
})
export class TagModule {
}
