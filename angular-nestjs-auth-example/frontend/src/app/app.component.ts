import { Component, signal } from '@angular/core';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AuthSectionComponent } from './components/auth-section/auth-section.component';
import { SplitLayoutComponent } from './components/split-layout/split-layout.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { ApiMonitorPanelComponent } from './components/api-monitor-panel/api-monitor-panel.component';
import { AuthService } from './services/auth.service';
import type { IToken } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppHeaderComponent,
    AuthSectionComponent,
    SplitLayoutComponent,
    LeftPanelComponent,
    ApiMonitorPanelComponent,
  ],
  template: `
    <app-header />
    <app-auth-section
      (authenticate)="onAuthenticate($event)"
      (endSession)="onEndSession()"
      [isAuthenticating]="isAuthenticating()"
      [isAuthenticated]="isAuthenticated()"
      [authenticatedUid]="authenticatedUid()"
      [error]="authError()"
    />
    <app-split-layout>
      <app-left-panel
        left
        [isAuthenticated]="isAuthenticated()"
        [token]="token()"
        [uid]="authenticatedUid()"
      />
      <app-api-monitor-panel right />
    </app-split-layout>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
  `,
})
export class AppComponent {
  isAuthenticated = signal(false);
  isAuthenticating = signal(false);
  authError = signal('');
  token = signal<IToken | null>(null);
  authenticatedUid = signal('');

  constructor(private authService: AuthService) {}

  async onAuthenticate(uid: string) {
    this.isAuthenticating.set(true);
    this.authError.set('');
    try {
      const token = await this.authService.authenticate(uid);
      this.token.set(token);
      this.authenticatedUid.set(uid);
      this.isAuthenticated.set(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed';
      this.authError.set(message);
    } finally {
      this.isAuthenticating.set(false);
    }
  }

  onEndSession() {
    this.isAuthenticated.set(false);
    this.token.set(null);
    this.authenticatedUid.set('');
    this.authError.set('');
  }
}
