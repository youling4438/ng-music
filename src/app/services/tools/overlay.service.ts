import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class OverlayService {
	private rd2: Renderer2;
	constructor(
		private rdFactory2: RendererFactory2,
	) {
		this.rd2 = this.rdFactory2.createRenderer(null, null)
	}

	create(){
		// this.rd2.createElement('div');
	}
}
