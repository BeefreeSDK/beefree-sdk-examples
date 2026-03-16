import { appConfig } from './app.config';

describe('appConfig', () => {
  it('defines providers', () => {
    expect(Array.isArray(appConfig.providers)).toBe(true);
    expect(appConfig.providers?.length).toBe(2);
  });
});
