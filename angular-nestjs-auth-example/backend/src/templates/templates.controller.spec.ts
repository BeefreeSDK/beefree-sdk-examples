import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

describe('TemplatesController', () => {
  it('returns sample template', () => {
    const service = {
      getSample: jest.fn().mockReturnValue({ id: 'sample' }),
      getBlank: jest.fn(),
    } as unknown as TemplatesService;

    const controller = new TemplatesController(service);
    expect(controller.getSample()).toEqual({ id: 'sample' });
    expect(service.getSample).toHaveBeenCalledTimes(1);
  });

  it('returns blank template', () => {
    const service = {
      getSample: jest.fn(),
      getBlank: jest.fn().mockReturnValue({ id: 'blank' }),
    } as unknown as TemplatesService;

    const controller = new TemplatesController(service);
    expect(controller.getBlank()).toEqual({ id: 'blank' });
    expect(service.getBlank).toHaveBeenCalledTimes(1);
  });
});
