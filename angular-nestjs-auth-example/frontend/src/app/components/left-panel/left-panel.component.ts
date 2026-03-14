import { Component, input } from '@angular/core';
import { UnauthInfoComponent } from '../unauth-info/unauth-info.component';
import { BuilderAreaComponent } from '../builder-area/builder-area.component';
import type { IToken } from '../../types';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [UnauthInfoComponent, BuilderAreaComponent],
  template: `
    @if (isAuthenticated()) {
      <app-builder-area [token]="token()" [uid]="uid()" />
    } @else {
      <app-unauth-info />
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class LeftPanelComponent {
  isAuthenticated = input(false);
  token = input<IToken | null>(null);
  uid = input('');
}
