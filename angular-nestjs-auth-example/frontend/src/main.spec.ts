import { bootstrapApplication } from '@angular/platform-browser';

vi.mock('@angular/platform-browser', () => ({
  bootstrapApplication: vi.fn().mockResolvedValue(undefined),
}));

describe('main bootstrap', () => {
  it('bootstraps the Angular application', async () => {
    vi.mocked(bootstrapApplication).mockResolvedValueOnce(undefined as never);

    await import('./main');

    expect(bootstrapApplication).toHaveBeenCalledOnce();
  });

  it('logs bootstrap errors', async () => {
    vi.resetModules();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(bootstrapApplication).mockRejectedValueOnce(new Error('boot-fail') as never);

    await import('./main');
    await Promise.resolve();

    expect(errorSpy).toHaveBeenCalled();
  });
});
