import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'app-rate',
	templateUrl: './rate.component.html',
	styleUrls: ['./rate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class RateComponent {

}
