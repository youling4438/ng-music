import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';
import {IconDirective} from './icon/icon.directive';
import {BtnDirective} from "./btn.directive";
import {ToggleMoreDirective} from './toggle-more.directive';
import {DragModule} from "./drag/drag.module";


@NgModule({
	declarations: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
	],
	exports: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
		DragModule,
	]
})
export class DirectivesModule {
}
