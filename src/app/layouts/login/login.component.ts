import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {OverlayConfig, OverlayRef, OverlayService} from "../../services/tools/overlay.service";
import {empty, first, merge, of, pluck, switchMap} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements AfterViewInit {
	private overlayRef: OverlayRef;
	formValues = this.fb.group({
		phone: ['', [
			Validators.required,
			Validators.pattern(/^1\d{10}$/),
		]],
		password: ['', [
			Validators.required,
			Validators.minLength(6),
		]],
	});
	@ViewChild('modalWrap', {static: true}) readonly modalWrap: ElementRef;

	constructor(
		private overlayServe: OverlayService,
		private rd2: Renderer2,
		private fb: FormBuilder,
	) {
	}

	createOverlay(): void {
		const overlayConfig: OverlayConfig = {
			center: true,
		};
		this.overlayRef = this.overlayServe.create(overlayConfig);
		merge(
			this.overlayRef.backdropClick(),
			this.overlayRef.backdropKeyup()
				.pipe(
					pluck('key'),
					switchMap(key => {
						return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
					})
				),
		).pipe(first()).subscribe(() => {
			this.hideOverlay();
		});
		this.rd2.appendChild(this.overlayRef.container, this.modalWrap.nativeElement,);
	}

	private hideOverlay(): void {
		if (this.overlayRef) {
			this.overlayRef.close();
			this.overlayRef = null;
		}
	}

	ngAfterViewInit(): void {
		this.createOverlay();
	}
}
