import { AppComponent } from './app.component';
import type { IToken } from './types';

describe('AppComponent', () => {
  it('authenticates successfully', async () => {
    const token: IToken = { access_token: 'tok' };
    const authService = {
      authenticate: vi.fn().mockResolvedValue(token),
    };
    const component = new AppComponent(authService as never);

    await component.onAuthenticate('u1');

    expect(authService.authenticate).toHaveBeenCalledWith('u1');
    expect(component.isAuthenticated()).toBe(true);
    expect(component.authenticatedUid()).toBe('u1');
    expect(component.token()).toEqual(token);
    expect(component.isAuthenticating()).toBe(false);
    expect(component.authError()).toBe('');
  });

  it('handles Error authentication failures', async () => {
    const authService = {
      authenticate: vi.fn().mockRejectedValue(new Error('bad creds')),
    };
    const component = new AppComponent(authService as never);

    await component.onAuthenticate('u2');

    expect(component.isAuthenticated()).toBe(false);
    expect(component.authError()).toBe('bad creds');
    expect(component.isAuthenticating()).toBe(false);
  });

  it('handles unknown authentication failures', async () => {
    const authService = {
      authenticate: vi.fn().mockRejectedValue('boom'),
    };
    const component = new AppComponent(authService as never);

    await component.onAuthenticate('u3');

    expect(component.authError()).toBe('Authentication failed');
    expect(component.isAuthenticating()).toBe(false);
  });

  it('ends session and resets auth state', () => {
    const token: IToken = { access_token: 'tok' };
    const authService = {
      authenticate: vi.fn().mockResolvedValue(token),
    };
    const component = new AppComponent(authService as never);

    component.isAuthenticated.set(true);
    component.token.set(token);
    component.authenticatedUid.set('u4');
    component.authError.set('x');

    component.onEndSession();

    expect(component.isAuthenticated()).toBe(false);
    expect(component.token()).toBeNull();
    expect(component.authenticatedUid()).toBe('');
    expect(component.authError()).toBe('');
  });
});
