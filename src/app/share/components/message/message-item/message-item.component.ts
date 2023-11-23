import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'app-message-item',
	templateUrl: './message-item.component.html',
	styleUrls: ['./message-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MessageItemComponent {

}
