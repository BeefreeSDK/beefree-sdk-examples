import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);
  private readonly sampleTemplate: Record<string, unknown>;
  private readonly blankTemplate: Record<string, unknown>;

  constructor() {
    this.sampleTemplate = JSON.parse(
      readFileSync(join(__dirname, 'data', 'sample.json'), 'utf-8'),
    );
    this.blankTemplate = JSON.parse(
      readFileSync(join(__dirname, 'data', 'blank.json'), 'utf-8'),
    );
    this.logger.log('Templates loaded from data/ folder');
  }

  getSample(): Record<string, unknown> {
    return this.sampleTemplate;
  }

  getBlank(): Record<string, unknown> {
    return this.blankTemplate;
  }
}
