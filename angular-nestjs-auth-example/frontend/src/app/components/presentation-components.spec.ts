import { AppHeaderComponent } from './app-header/app-header.component';
import { TestBed } from '@angular/core/testing';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { UnauthInfoComponent } from './unauth-info/unauth-info.component';

describe('presentation components', () => {
  it('instantiates header component', () => {
    const component = new AppHeaderComponent();
    expect(component).toBeTruthy();
  });

  it('instantiates left panel component', () => {
    const component = TestBed.runInInjectionContext(() => new LeftPanelComponent());
    expect(component).toBeTruthy();
    expect(component.uid()).toBe('');
    expect(component.isAuthenticated()).toBe(false);
    expect(component.token()).toBeNull();
  });

  it('instantiates unauth info component', () => {
    const component = new UnauthInfoComponent();
    expect(component).toBeTruthy();
  });
});
