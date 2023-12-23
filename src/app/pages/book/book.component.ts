import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-book',
  template: `
    <p>
      book works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent {

}
