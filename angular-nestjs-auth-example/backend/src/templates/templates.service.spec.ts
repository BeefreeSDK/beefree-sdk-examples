import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  it('loads sample and blank templates from data files', () => {
    const service = new TemplatesService();

    const sample = service.getSample();
    const blank = service.getBlank();

    expect(sample).toBeTruthy();
    expect(blank).toBeTruthy();
    expect(typeof sample).toBe('object');
    expect(typeof blank).toBe('object');
  });
});
