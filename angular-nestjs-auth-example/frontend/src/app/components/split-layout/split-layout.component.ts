import { Component, signal, computed, HostListener } from '@angular/core';

@Component({
  selector: 'app-split-layout',
  standalone: true,
  template: `
    <div class="split-container" #container>
      <div
        class="left-panel"
        [class.dragging]="isDragging()"
        [style.width.%]="leftWidth()"
        role="group"
      >
        <ng-content select="[left]" />
      </div>
      <div
        class="split-divider"
        [class.dragging]="isDragging()"
        role="separator"
        aria-orientation="vertical"
        [attr.aria-valuenow]="leftWidth()"
        [attr.aria-valuemin]="20"
        [attr.aria-valuemax]="80"
        aria-label="Resize panels"
        tabindex="0"
        (mousedown)="startDrag($event)"
        (keydown)="onDividerKeyDown($event)"
      >
        <div class="split-divider-handle"></div>
      </div>
      <div
        class="right-panel"
        [class.dragging]="isDragging()"
        [style.width.%]="rightWidth()"
        role="group"
      >
        <ng-content select="[right]" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .split-container {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .left-panel, .right-panel {
      overflow: hidden;
      height: 100%;
      min-width: 0;
      position: relative;
    }
    .left-panel.dragging, .right-panel.dragging {
      pointer-events: none;
      user-select: none;
    }
    .split-divider {
      flex-shrink: 0;
      width: 6px;
      cursor: col-resize;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .split-divider:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: -1px;
    }
    .split-divider:hover,
    .split-divider.dragging {
      background: #b0b0b0;
    }
    .split-divider-handle {
      width: 2px;
      height: 32px;
      border-radius: 1px;
      background: #999;
    }
    .split-divider.dragging .split-divider-handle {
      background: #666;
    }
  `,
})
export class SplitLayoutComponent {
  leftWidth = signal(60);
  rightWidth = computed(() => 100 - this.leftWidth());
  isDragging = signal(false);

  private containerEl: HTMLElement | null = null;

  startDrag(event: MouseEvent) {
    event.preventDefault();
    this.containerEl = (event.target as HTMLElement).closest('.split-container');
    this.isDragging.set(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  onDividerKeyDown(event: KeyboardEvent) {
    const step = 2;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.leftWidth.set(Math.max(20, this.leftWidth() - step));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.leftWidth.set(Math.min(80, this.leftWidth() + step));
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging() || !this.containerEl) return;
    const rect = this.containerEl.getBoundingClientRect();
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    this.leftWidth.set(Math.max(20, Math.min(80, pct)));
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this.containerEl = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
}
