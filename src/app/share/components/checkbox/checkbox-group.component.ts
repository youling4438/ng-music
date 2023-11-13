import {ChangeDetectionStrategy, Component, forwardRef,} from '@angular/core';
import {CheckboxComponent} from "./checkbox.component";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export type CheckBoxValue = string | number;

@Component({
    selector: 'app-checkbox-group',
    template: `
        <div class="app-checkbox-group">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        .app-checkbox-group {
            display: inline-block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxGroupComponent),
            multi: true,
        }
    ],
})
export class CheckboxGroupComponent implements ControlValueAccessor {
    private checkBoxList: CheckboxComponent[] = [];
    private current: CheckBoxValue[] = [];

    addCheckBox(checkBox: CheckboxComponent): void {
        this.checkBoxList.push(checkBox);
        console.log('this.checkBoxList', this.checkBoxList);
    }

    private updateCheckbox(current: CheckBoxValue[]): void {
        if (this.checkBoxList.length) {
            this.checkBoxList.forEach(checkbox => {
                checkbox.writeValue(current.includes(checkbox.value));
            });
            this.current = current;
            this.onChange(current);
        }
    }

    private onChange = (value: CheckBoxValue[]) => {
    }
    private onTouched = () => {
    }

    registerOnChange(fn: (value: CheckBoxValue[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(checks: CheckBoxValue[]): void {
        if (checks) {
            this.updateCheckbox(checks);
        }
    }

    handleCheckboxClick(value: CheckBoxValue, checked: boolean): void {
        const newCurrent = this.current.slice();
        if(checked) {
            if(!newCurrent.includes(value)){
                newCurrent.push(value);
            }
        } else {
            const targetIndex = newCurrent.findIndex(item=> item === value);
            if(targetIndex > -1 ) {
                newCurrent.splice(targetIndex, 1);
            }
        }
        this.writeValue(newCurrent);
    }
}
