import {NgModule} from '@angular/core';
import {DragDirective} from './drag.directive';
import {DragHandleDirective} from './drag-handle.directive';


@NgModule({
	declarations: [
		DragDirective,
		DragHandleDirective,
	],
	exports: [
		DragDirective,
		DragHandleDirective,
	],
})
export class DragModule {
}
