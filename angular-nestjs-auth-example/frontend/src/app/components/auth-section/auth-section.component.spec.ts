import { AuthSectionComponent } from './auth-section.component';
import { TestBed } from '@angular/core/testing';

const createComponent = () =>
  TestBed.runInInjectionContext(() => new AuthSectionComponent());

describe('AuthSectionComponent', () => {
  it('emits authenticate with trimmed uid', () => {
    const component = createComponent();
    const emitted: string[] = [];
    component.authenticate.subscribe((value) => emitted.push(value));

    component.uid = '  user-1  ';
    component.onAuth();

    expect(emitted).toEqual(['user-1']);
  });

  it('does not emit authenticate when uid is blank', () => {
    const component = createComponent();
    const spy = vi.fn();
    component.authenticate.subscribe(spy);

    component.uid = '   ';
    component.onAuth();

    expect(spy).not.toHaveBeenCalled();
  });

  it('emits endSession and resets uid', () => {
    const component = createComponent();
    const spy = vi.fn();
    component.endSession.subscribe(spy);

    component.uid = 'something';
    component.onEndSession();

    expect(spy).toHaveBeenCalledOnce();
    expect(component.uid).toBe('angular-nestjs-demo');
  });
});
