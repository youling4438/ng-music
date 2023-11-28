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
import {LoginRes, UserService} from "../../services/apis/user.service";
import {WindowService} from "../../services/tools/window.service";
import {storageKeys} from "../../share/config";
import {ContextService} from "../../services/business/context.service";
import {MessageService} from "../../share/components/message/message.service";

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
	remember: boolean = true;
	@Output() responseEvent = new EventEmitter<void>();
	private overlayRef: OverlayRef;
	readonly isBrowser: boolean;
	formValues: FormGroup = this.getFormValues();
	@ViewChild('modalWrap', {static: false}) readonly modalWrap: ElementRef;

	constructor(
		private overlayServe: OverlayService,
		private rd2: Renderer2,
		private fb: FormBuilder,
		private userServe: UserService,
		private windowServe: WindowService,
		private contextServe: ContextService,
		@Inject(PLATFORM_ID) private platformId: object,
		private messageServe: MessageService,
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	getFormValues(): FormGroup {
		return this.fb.group({
			phone: ['15829269880', [
				Validators.required,
				Validators.pattern(/^1\d{10}$/),
			]],
			password: ['angular10', [
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
		this.userServe.login(this.formValues.value).subscribe((res: LoginRes) => {
			this.responseEvent.emit();
			this.contextServe.setUser(res.user);
			this.windowServe.setStorage(storageKeys.token, res.token);
			if (this.remember) {
				this.windowServe.setStorage(storageKeys.remember, `${this.remember}`);
			}
			this.messageServe.success('登录成功');
		});
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
