import {NgModule} from '@angular/core';
import {MessageComponent} from './message.component';
import {DirectivesModule} from "../../directives/directives.module";
import {NgForOf, NgIf} from "@angular/common";
import {MessageItemComponent} from './message-item/message-item.component';


@NgModule({
	declarations: [
		MessageComponent,
		MessageItemComponent,
	],
	imports: [
		DirectivesModule,
		NgForOf,
		NgIf,
	],
})
export class MessageModule {
}
