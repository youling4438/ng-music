import {ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import {BreadcrumbComponent} from "../breadcrumb.component";

@Component({
	selector: 'app-breadcrumb-item',
	templateUrl: './breadcrumb-item.component.html',
	styleUrls: ['./breadcrumb-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbItemComponent {
	constructor(@Optional() readonly parent: BreadcrumbComponent) {
	}


}
