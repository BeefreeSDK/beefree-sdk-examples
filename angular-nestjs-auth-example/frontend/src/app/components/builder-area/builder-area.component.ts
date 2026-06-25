import { Component, effect, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeefreeBuilder, BeefreeService, type IToken, type IBeeConfig, type IEntityContentJson } from '@beefree.io/angular-email-builder';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-builder-area',
  standalone: true,
  imports: [BeefreeBuilder],
  template: `
    <div class="builder-menu-bar">
      <button (click)="loadTemplate('sample')" [disabled]="isLoading()">
        Load Sample Template
      </button>
      <button (click)="loadTemplate('blank')" [disabled]="isLoading()">
        Load Blank Template
      </button>
    </div>
    <div class="builder-container">
      @if (token() && currentTemplate()) {
        <lib-beefree-builder
          [token]="token()!"
          [template]="currentTemplate()"
          [config]="builderConfig()"
          [width]="'100%'"
          [height]="'100%'"
          (bbSave)="onSave($event)"
          (bbError)="onError($event)"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .builder-menu-bar {
      background: #262626;
      color: white;
      padding: 0 15px;
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .builder-menu-bar button {
      padding: 7px 16px;
      background: #7638ff;
      color: white;
      border: 1px solid #7638ff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: opacity 0.2s;
    }
    .builder-menu-bar button:hover:not(:disabled) {
      opacity: 0.8;
    }
    .builder-menu-bar button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .builder-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
      min-height: 0;
    }
    .builder-container lib-beefree-builder {
      display: block;
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 0;
    }
  `,
})
export class BuilderAreaComponent {
  token = input<IToken | null>(null);
  uid = input('');
  isLoading = signal(false);
  currentTemplate = signal<IEntityContentJson | null>(null);

  private http = inject(HttpClient);
  private beefreeService = inject(BeefreeService);
  private initialized = false;

  private downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  builderConfig = signal<IBeeConfig>({
    container: 'bee-plugin-container',
    uid: 'angular-nestjs-demo',
  });

  private buildBuilderConfig(uid: string): IBeeConfig {
    return {
      container: 'bee-plugin-container',
      uid,
      onSave: (_pageJson: string, pageHtml: string) => {
        this.downloadFile(
          `design-${Date.now()}.html`,
          pageHtml,
          'text/html;charset=utf-8',
        );
      },
      onSaveAsTemplate: (pageJson: string | Record<string, unknown>) => {
        const parsed =
          typeof pageJson === 'string' ? JSON.parse(pageJson) : pageJson;
        const content = JSON.stringify(parsed, null, 2);
        this.downloadFile(
          `template-${Date.now()}.json`,
          content,
          'application/json',
        );
      },
    };
  }

  private initializeBuilder(token: IToken | null, uid: string): void {
    if (!token || this.initialized) {
      return;
    }

    this.initialized = true;
    if (uid) {
      this.builderConfig.set(this.buildBuilderConfig(uid));
    }
    this.fetchTemplate('sample');
  }

  /* c8 ignore next 5 */
  constructor() {
    effect(() => {
      this.initializeBuilder(this.token(), this.uid());
    });
  }

  private async fetchTemplate(type: 'sample' | 'blank') {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<IEntityContentJson>(`/template/${type}`),
      );
      this.currentTemplate.set(data);
    } catch (err) {
      console.error(`Failed to load ${type} template:`, err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadTemplate(type: 'sample' | 'blank') {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<IEntityContentJson>(`/template/${type}`),
      );
      this.beefreeService.load(data);
    } catch (err) {
      console.error(`Failed to load ${type} template:`, err);
    } finally {
      this.isLoading.set(false);
    }
  }

  onSave(event: [string, string, string | null, number, string | null]) {
    console.log('💾 Saved:', event[0]);
  }

  onError(error: unknown) {
    console.error('❌ Error:', error);
  }
}
