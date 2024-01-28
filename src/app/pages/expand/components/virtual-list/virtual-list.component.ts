import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {ScrollService} from "../../../../services/tools/scroll.service";

interface VirtualItemContext{
	item: any;
	index: number;
}
@Component({
	selector: 'app-virtual-list',
	templateUrl: './virtual-list.component.html',
	styleUrl: './virtual-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent {
	@Input() list: any[];
	@Input() itemTpl: TemplateRef<VirtualItemContext>;
	constructor(scrollServe: ScrollService) {
	}
}
