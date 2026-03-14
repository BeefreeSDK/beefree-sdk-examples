import { Controller, Get } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('template')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get('sample')
  getSample() {
    return this.templatesService.getSample();
  }

  @Get('blank')
  getBlank() {
    return this.templatesService.getBlank();
  }
}
