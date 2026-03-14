import { SplitLayoutComponent } from './split-layout.component';

describe('SplitLayoutComponent', () => {
  let component: SplitLayoutComponent;

  beforeEach(() => {
    component = new SplitLayoutComponent();
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  it('starts drag and sets body styles', () => {
    const container = document.createElement('div');
    container.className = 'split-container';
    const divider = document.createElement('div');
    container.appendChild(divider);
    document.body.appendChild(container);

    const event = {
      preventDefault: vi.fn(),
      target: divider,
    } as unknown as MouseEvent;

    component.startDrag(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.isDragging()).toBe(true);
    expect(document.body.style.cursor).toBe('col-resize');
    expect(document.body.style.userSelect).toBe('none');

    document.body.removeChild(container);
  });

  it('moves divider with mouse when dragging', () => {
    const container = document.createElement('div');
    container.className = 'split-container';
    const divider = document.createElement('div');
    container.appendChild(divider);
    document.body.appendChild(container);

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 500,
      top: 0,
      right: 600,
      bottom: 0,
      height: 0,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    });

    component.startDrag({ preventDefault: vi.fn(), target: divider } as unknown as MouseEvent);
    component.onMouseMove({ clientX: 350 } as MouseEvent);

    expect(component.leftWidth()).toBe(50);

    document.body.removeChild(container);
  });

  it('ignores mouse move when not dragging', () => {
    component.leftWidth.set(60);
    component.onMouseMove({ clientX: 250 } as MouseEvent);
    expect(component.leftWidth()).toBe(60);
  });

  it('handles ArrowLeft and ArrowRight keyboard resizing with bounds', () => {
    const leftEvent = { key: 'ArrowLeft', preventDefault: vi.fn() } as unknown as KeyboardEvent;
    const rightEvent = { key: 'ArrowRight', preventDefault: vi.fn() } as unknown as KeyboardEvent;

    component.leftWidth.set(21);
    component.onDividerKeyDown(leftEvent);
    component.onDividerKeyDown(leftEvent);

    expect(component.leftWidth()).toBe(20);
    expect(leftEvent.preventDefault).toHaveBeenCalled();

    component.leftWidth.set(79);
    component.onDividerKeyDown(rightEvent);
    component.onDividerKeyDown(rightEvent);

    expect(component.leftWidth()).toBe(80);
    expect(rightEvent.preventDefault).toHaveBeenCalled();
  });

  it('ignores unrelated keys', () => {
    component.leftWidth.set(40);
    component.onDividerKeyDown({ key: 'Enter', preventDefault: vi.fn() } as unknown as KeyboardEvent);
    expect(component.leftWidth()).toBe(40);
  });

  it('stops dragging and clears styles on mouse up', () => {
    const container = document.createElement('div');
    container.className = 'split-container';
    const divider = document.createElement('div');
    container.appendChild(divider);
    document.body.appendChild(container);

    component.startDrag({ preventDefault: vi.fn(), target: divider } as unknown as MouseEvent);
    component.onMouseUp();

    expect(component.isDragging()).toBe(false);
    expect(document.body.style.cursor).toBe('');
    expect(document.body.style.userSelect).toBe('');

    document.body.removeChild(container);
  });

  it('returns early on mouse up when not dragging', () => {
    component.onMouseUp();
    expect(component.isDragging()).toBe(false);
  });
});
