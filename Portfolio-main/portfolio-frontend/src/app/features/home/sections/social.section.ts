import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { SocialLink } from '../../../core/models/portfolio.models';
import { environment } from '../../../../environments/environment';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Find Me Online</h2>
      <div class="grid">
        @for (s of items(); track s.id) {
          @if (isValid(s.url)) {
            <a class="card link" [href]="s.url" target="_blank" rel="noopener noreferrer"
               [attr.aria-label]="s.platform" [attr.data-testid]="'social-' + s.platform.toLowerCase()">
              <i class="fa-brands" [ngClass]="iconClass(s.platform)"></i>
              <span>{{ s.platform }}</span>
            </a>
          }
        }
        <a class="card link whatsapp" [href]="waLink()" target="_blank" rel="noopener noreferrer"
           data-testid="whatsapp-btn" aria-label="Message me on WhatsApp">
          <i class="fa-brands fa-whatsapp"></i>
          <span>Message me on WhatsApp</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 24px; }
    .link { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--text); font-weight: 600; }
    .link i { font-size: 1.5rem; color: var(--accent); }
    .whatsapp i { color: #25d366; }
  `]
})
export class SocialSection implements OnInit {
  private svc = inject(PortfolioService);
  items = signal<SocialLink[]>([]);
  ngOnInit() { this.svc.getSocialLinks().subscribe(x => this.items.set(x)); }

  isValid(url: string): boolean {
    return !!url && !url.includes('[YOUR_');
  }
  waLink(): string {
    const n = (environment.whatsappNumber || '').replace(/\D/g, '');
    const t = encodeURIComponent(environment.whatsappMessage);
    return `https://wa.me/${n || '[YOUR_WHATSAPP_NUMBER]'}?text=${t}`;
  }
  iconClass(platform: string): string {
    const m: Record<string,string> = {
      LinkedIn: 'fa-linkedin', GitHub: 'fa-github',
      Instagram: 'fa-instagram', Twitter: 'fa-x-twitter',
      YouTube: 'fa-youtube', WhatsApp: 'fa-whatsapp'
    };
    return m[platform] || 'fa-link';
  }
}
