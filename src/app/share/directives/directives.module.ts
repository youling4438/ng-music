import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';
import {IconDirective} from './icon/icon.directive';
import {BtnDirective} from "./btn.directive";
import {ToggleMoreDirective} from './toggle-more.directive';
import {DragModule} from "./drag/drag.module";
import {ImgLazyDirective} from './img-lazy.directive';


@NgModule({
	declarations: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
		ImgLazyDirective,
	],
	exports: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
		DragModule,
		ImgLazyDirective,
	]
})
export class DirectivesModule {
}
