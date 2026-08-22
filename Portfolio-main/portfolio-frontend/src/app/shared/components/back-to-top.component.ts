import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  template: `
    @if (visible()) {
      <button class="btt" (click)="up()" aria-label="Back to top" data-testid="back-to-top">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    }
  `,
  styles: [`
    .btt {
      position: fixed; right: 24px; bottom: 96px; z-index: 90;
      width: 44px; height: 44px; border-radius: 999px;
      border: 1px solid var(--card-border);
      background: var(--card); color: var(--text);
      backdrop-filter: blur(16px);
      box-shadow: var(--shadow);
    }
    .btt:hover { color: var(--accent); border-color: var(--accent); }
  `]
})
export class BackToTopComponent {
  visible = signal(false);
  @HostListener('window:scroll')
  onScroll() { this.visible.set(window.scrollY > 400); }
  up() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
