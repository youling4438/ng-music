import {NgModule} from '@angular/core';
import {DragDirective} from './drag.directive';


@NgModule({
	declarations: [
		DragDirective,
	],
	exports: [
		DragDirective,
	],
})
export class DragModule {
}
