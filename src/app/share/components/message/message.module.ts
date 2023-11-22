import {NgModule} from '@angular/core';
import {MessageComponent} from './message.component';
import {DirectivesModule} from "../../directives/directives.module";
import {NgForOf} from "@angular/common";
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
	declarations: [
		MessageComponent,
	],
	imports: [
		DirectivesModule,
		NgForOf,
		PipesModule,
	],
	exports: [
		MessageComponent,
	]
})
export class MessageModule {
}
