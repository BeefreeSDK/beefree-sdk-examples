import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { BeefreeService } from '@beefree.io/angular-email-builder';
import { BuilderAreaComponent } from './builder-area.component';

describe('BuilderAreaComponent', () => {
  const beefreeService = {
    load: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    beefreeService.load.mockReset();
  });

  it('loads template from API', async () => {
    const http = {
      get: vi.fn().mockReturnValue(of({ page: { title: 'sample' } })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());

    await (component as any).fetchTemplate('sample');

    expect(http.get).toHaveBeenCalledWith('/template/sample');
    expect(component.currentTemplate()).toEqual({ page: { title: 'sample' } });
    expect(component.isLoading()).toBe(false);
  });

  it('handles fetch template errors', async () => {
    const http = {
      get: vi.fn().mockReturnValue(throwError(() => new Error('x'))),
    };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());
    await (component as any).fetchTemplate('blank');

    expect(errorSpy).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('loads template into Beefree service', async () => {
    const http = {
      get: vi.fn().mockReturnValue(of({ page: { title: 'blank' } })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());

    await component.loadTemplate('blank');

    expect(http.get).toHaveBeenCalledWith('/template/blank');
    expect(beefreeService.load).toHaveBeenCalledWith({ page: { title: 'blank' } });
    expect(component.isLoading()).toBe(false);
  });

  it('handles loadTemplate errors', async () => {
    const http = {
      get: vi.fn().mockReturnValue(throwError(() => new Error('nope'))),
    };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());
    await component.loadTemplate('sample');

    expect(errorSpy).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('logs save and error callbacks', () => {
    const http = {
      get: vi.fn().mockReturnValue(of({})),
    };
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());

    component.onSave(['json', 'html', null, 0, null]);
    component.onError(new Error('x'));

    expect(logSpy).toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalled();
  });

  it('downloads files from callback helpers', () => {
    const http = {
      get: vi.fn().mockReturnValue(of({})),
    };

    if (!('createObjectURL' in URL)) {
      Object.defineProperty(URL, 'createObjectURL', {
        value: () => 'blob:temp',
        writable: true,
      });
    }
    if (!('revokeObjectURL' in URL)) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: () => undefined,
        writable: true,
      });
    }

    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:abc');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.fn();
    const createElement = vi
      .spyOn(document, 'createElement')
      .mockImplementation(() => ({ click } as unknown as HTMLAnchorElement));

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());

    (component as any).downloadFile('x.txt', 'abc', 'text/plain');

    expect(createObjectURL).toHaveBeenCalled();
    expect(createElement).toHaveBeenCalledWith('a');
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:abc');
  });

  it('builds callbacks that export HTML and template JSON', () => {
    const http = {
      get: vi.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());
    const downloadSpy = vi.spyOn(component as never, 'downloadFile');
    const config = (component as never).buildBuilderConfig('user-77');

    expect(config.uid).toBe('user-77');

    config.onSave?.('json', '<html />');
    config.onSaveAsTemplate?.('{"x":1}' as never);
    config.onSaveAsTemplate?.({ y: 2 } as never);

    expect(downloadSpy).toHaveBeenCalledTimes(3);
  });

  it('initializes builder only once and skips empty uid config override', () => {
    const http = {
      get: vi.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());
    const fetchSpy = vi
      .spyOn(component as never, 'fetchTemplate')
      .mockResolvedValue(undefined as never);

    (component as never).initializeBuilder(null, 'uid');
    expect(fetchSpy).not.toHaveBeenCalled();

    (component as never).initializeBuilder({ access_token: 'x' }, '');
    expect(fetchSpy).toHaveBeenCalledWith('sample');
    const uidAfterInit = component.builderConfig().uid;

    (component as never).initializeBuilder({ access_token: 'x' }, 'uid-late');
    expect(component.builderConfig().uid).toBe(uidAfterInit);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('initializes with uid and builds uid-specific config', () => {
    const http = {
      get: vi.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: BeefreeService, useValue: beefreeService },
      ],
    });

    const component = TestBed.runInInjectionContext(() => new BuilderAreaComponent());
    const fetchSpy = vi
      .spyOn(component as never, 'fetchTemplate')
      .mockResolvedValue(undefined as never);

    (component as never).initializeBuilder({ access_token: 'tok' }, 'uid-branch');

    expect(component.builderConfig().uid).toBe('uid-branch');
    expect(fetchSpy).toHaveBeenCalledWith('sample');
  });

});
