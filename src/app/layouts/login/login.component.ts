import {
	ChangeDetectionStrategy,
	Component,
	ElementRef, EventEmitter, Inject,
	Input, OnChanges, Output, PLATFORM_ID,
	Renderer2,
	ViewChild
} from '@angular/core';
import {OverlayConfig, OverlayRef, OverlayService} from "../../services/tools/overlay.service";
import {empty, first, merge, of, pluck, switchMap, timer} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {isPlatformBrowser} from "@angular/common";
import {animate, style, transition, trigger, AnimationEvent} from "@angular/animations";

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
	animations: [
		trigger('dialogAni', [
			transition(':enter', [
				style({
					opacity: 0,
					transform: 'translateY(100%)',
				}),
				animate('.2s', style({
					opacity: 1,
					transform: 'translateY(0)',
				})),
			]),
			transition(':leave', [
				animate('.3s', style({
					opacity: 0,
					transform: 'translateY(-100%)',
				}))
			]),
		])
	]
})
export class LoginComponent implements OnChanges {
	@Input() showDialog: boolean = false;
	visible: boolean;
	@Output() responseEvent = new EventEmitter<void>();
	private overlayRef: OverlayRef;
	readonly isBrowser: boolean;
	formValues: FormGroup = this.getFormValues();
	@ViewChild('modalWrap', {static: false}) readonly modalWrap: ElementRef;

	constructor(
		private overlayServe: OverlayService,
		private rd2: Renderer2,
		private fb: FormBuilder,
		@Inject(PLATFORM_ID) private platformId: object,
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	getFormValues(): FormGroup {
		return this.fb.group({
			phone: ['', [
				Validators.required,
				Validators.pattern(/^1\d{10}$/),
			]],
			password: ['', [
				Validators.required,
				Validators.minLength(6),
			]],
		});
	}

	ngOnChanges(): void {
		if (this.showDialog) {
			this.createOverlay();
		} else {
			this.visible = false;
		}
	}

	createOverlay(): void {
		if (this.isBrowser) {
			this.formValues = this.getFormValues();
			const overlayConfig: OverlayConfig = {
				center: true,
				fade: false,
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
				this.responseEvent.emit();
			});
			this.visible = true;
			timer(0).subscribe(() => {
				this.rd2.appendChild(this.overlayRef.container, this.modalWrap.nativeElement,);
			});
		}
	}

	private hideOverlay(): void {
		if (this.overlayRef) {
			this.overlayRef.close();
			this.overlayRef = null;
		}
	}

	animationDone(event: AnimationEvent): void {
		if (event.toState === 'void') {
			this.hideOverlay();
		}
	}

	formSubmit(): void {
		console.log('submit');
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
}
