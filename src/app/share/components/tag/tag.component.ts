import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef, EventEmitter, HostBinding,
	Input, OnChanges, Output,
	Renderer2, SimpleChanges,
	ViewEncapsulation,
} from '@angular/core';

const ColorPresets = ['magenta', 'orange', 'green'];
type TagMode = 'default' | 'circle';

@Component({
	selector: 'app-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})

export class TagComponent implements OnChanges {
	@Input() tagColor: string = '';
	@Input() tagShape: TagMode = 'default';
	@Input() tagCloseAble = false;
	@Output() closed = new EventEmitter<void>();

	private currentColorClass = '';

	constructor(
		private el: ElementRef,
		private rd2: Renderer2,
		private cdr: ChangeDetectorRef,
	) {
	}

	@HostBinding('class.app-tag') commonClass = true;

	@HostBinding('class.app-tag-close') get closeClass(): boolean {
		return this.tagCloseAble;
	}

	@HostBinding('class.app-tag-circle') get circleClass(): boolean {
		return this.tagShape === 'circle';
	}

	private setStyle(tagColorChanges): void {
		const tagWarp = this.el.nativeElement;
		if (!tagWarp || !this.tagColor) { return; }
		if (ColorPresets.includes(this.tagColor)) {
			if (tagColorChanges.previousValue && ColorPresets.includes(tagColorChanges.previousValue)) {
				this.rd2.removeClass(tagWarp, `app-tag-${tagColorChanges.previousValue}`);
			}
			if (this.currentColorClass) {
				this.rd2.removeClass(tagWarp, this.currentColorClass);
				this.currentColorClass = '';
			}
			this.currentColorClass = `app-tag-${this.tagColor}`;
			this.rd2.addClass(tagWarp, this.currentColorClass);
			this.rd2.removeStyle(tagWarp, 'color');
			this.rd2.removeStyle(tagWarp, 'border-color');
			this.rd2.removeStyle(tagWarp, 'background-color');
		} else {
			this.rd2.setStyle(tagWarp, 'color', '#fff');
			this.rd2.setStyle(tagWarp, 'border-color', 'transparent');
			this.rd2.setStyle(tagWarp, 'background-color', this.tagColor);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.setStyle(changes['tagColor']);
	}
}
