import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';
import {IconDirective} from './icon/icon.directive';
import {BtnDirective} from "./btn.directive";
import {ToggleMoreDirective} from './toggle-more.directive';
import {DragModule} from "./drag/drag.module";
import {ImgLazyDirective} from './img-lazy.directive';
import {RipplesDirective} from './ripples.directive';


@NgModule({
	declarations: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
		ImgLazyDirective,
		RipplesDirective,
	],
	exports: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
		DragModule,
		ImgLazyDirective,
		RipplesDirective,
	]
})
export class DirectivesModule {
}
