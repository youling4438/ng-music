import {Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
	selector: '[appStrTplOutLet]'
})

export class StrTplOutLetDirective implements OnChanges {
	@Input() appStrTplOutLet: string | TemplateRef<any>;
	@Input() appStrTplOutLetContext: any;
	constructor(private containerRef: ViewContainerRef, private templateRef: TemplateRef<any>) {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['appStrTplOutLet']) {
			this.containerRef.clear();
			// const template = (changes.appStrTplOutLet.currentValue instanceof TemplateRef) ? this.appStrTplOutLet : this.templateRef;
			const template: TemplateRef<any> = this.appStrTplOutLet instanceof TemplateRef ? this.appStrTplOutLet : this.templateRef;
			this.containerRef.createEmbeddedView(template, this.appStrTplOutLetContext);
		}
	}
}
