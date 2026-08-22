import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="nav" [class.scrolled]="scrolled()" aria-label="Primary">
      <div class="container inner">
        <a routerLink="/" fragment="hero" class="brand" data-testid="brand-link">
          <span class="dot"></span>
          <span class="name">Bhuvnesh</span>
        </a>
        <ul class="links" role="menubar">
          @for (l of links; track l.id) {
            <li role="none">
              @if (l.route) {
                <a role="menuitem" [routerLink]="l.route" [attr.data-testid]="'nav-' + l.id">{{ l.label }}</a>
              } @else {
                <a role="menuitem" routerLink="/" [fragment]="l.fragment" [attr.data-testid]="'nav-' + l.id">{{ l.label }}</a>
              }
            </li>
          }
        </ul>
        <div class="actions">
          <button class="icon-btn" (click)="theme.toggle()" [attr.aria-label]="'Toggle theme'" data-testid="theme-toggle">
            <i class="fa-solid" [class.fa-moon]="theme.theme()==='light'" [class.fa-sun]="theme.theme()==='dark'"></i>
          </button>
          <a class="btn primary hire" routerLink="/" fragment="contact" data-testid="nav-hire-btn">Hire Me</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav {
      position: sticky; top: 0; z-index: 100;
      transition: background .25s ease, border-color .25s ease, backdrop-filter .25s ease;
      border-bottom: 1px solid transparent;
    }
    .nav.scrolled {
      background: color-mix(in oklab, var(--bg-0) 85%, transparent);
      backdrop-filter: blur(16px);
      border-bottom-color: var(--card-border);
    }
    .inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; }
    .brand { display: flex; align-items: center; gap: 12px; color: var(--text); font-weight: 700; }
    .brand:hover { color: var(--text); }
    .dot { width: 12px; height: 12px; border-radius: 999px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      box-shadow: 0 0 20px var(--accent);
    }
    .name { font-family: var(--font-mono); letter-spacing: .04em; }
    .links { display: flex; gap: 28px; list-style: none; margin: 0; padding: 0; }
    .links a { color: var(--text-dim); font-size: .92rem; }
    .links a:hover { color: var(--text); }
    .actions { display: flex; gap: 12px; align-items: center; }
    .icon-btn {
      width: 38px; height: 38px; border-radius: 999px; border: 1px solid var(--card-border);
      background: var(--card); color: var(--text);
    }
    .icon-btn:hover { color: var(--accent); border-color: var(--accent); }
    @media (max-width: 820px) {
      .links { display: none; }
      .hire { display: none; }
    }
  `]
})
export class NavbarComponent {
  theme = inject(ThemeService);
  scrolled = signal(false);
  links: { id: string; label: string; fragment?: string; route?: string }[] = [
    { id: 'about', label: 'About', fragment: 'about' },
    { id: 'projects', label: 'Projects', fragment: 'projects' },
    { id: 'skills', label: 'Skills', fragment: 'skills' },
    { id: 'experience', label: 'Experience', fragment: 'experience' },
    { id: 'blog', label: 'Blog', route: '/blog' },
    { id: 'contact', label: 'Contact', fragment: 'contact' }
  ];

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 12); }
}
