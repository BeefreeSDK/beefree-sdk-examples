import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';

describe('module declarations', () => {
  it('loads AuthModule class', () => {
    expect(AuthModule).toBeDefined();
  });

  it('loads TemplatesModule class', () => {
    expect(TemplatesModule).toBeDefined();
  });
});
