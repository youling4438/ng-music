import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {OverlayConfig, OverlayRef, OverlayService} from "../../services/tools/overlay.service";
import {empty, first, merge, of, pluck, switchMap} from "rxjs";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";

interface CostumeControlItem {
	control: AbstractControl,
	showError: boolean,
	errors: ValidationErrors,
}

interface CostumeControls {
	phone: CostumeControlItem,
	password: CostumeControlItem,
}


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

	get formControls(): CostumeControls {
		const controls = {
			phone: this.formValues.get('phone'),
			password: this.formValues.get('password'),
		};
		return {
			phone: {
				control: controls.phone,
				showError: controls.phone.dirty && controls.phone.invalid,
				errors: controls.phone.errors,
			},
			password: {
				control: controls.password,
				showError: controls.password.dirty && controls.password.invalid,
				errors: controls.password.errors,
			},
		}
	}

	formSubmit() :void{
		console.log('submit');
	}
}
