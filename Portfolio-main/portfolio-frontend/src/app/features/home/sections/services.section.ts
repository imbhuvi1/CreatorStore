import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ServiceOffering } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Things I Can Help With</h2>
      <p class="lead">Beyond software development — a mix of skills I've picked up alongside engineering.</p>
      <div class="grid">
        @for (s of items(); track s.id) {
          <article class="card" appReveal [attr.data-testid]="'service-' + s.id">
            <div class="ico"><i class="fa-solid" [ngClass]="mapIcon(s.icon)"></i></div>
            <h3>{{ s.name }}</h3>
            <p>{{ s.description }}</p>
            @if (s.tools) { <p class="muted small"><strong>Tools:</strong> {{ s.tools }}</p> }
            <div class="row">
              <span class="badge">{{ s.startingPrice || 'Contact for details' }}</span>
              <a class="btn ghost" href="#contact">Enquire</a>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .lead { max-width: 620px; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .ico {
      width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
      background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(125,211,252,0.2));
      color: var(--accent-2); font-size: 1.3rem; margin-bottom: 10px;
    }
    .row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; flex-wrap: wrap; gap: 8px; }
    .muted { color: var(--text-dim); }
    .small { font-size: .85rem; }
  `]
})
export class ServicesSection implements OnInit {
  private svc = inject(PortfolioService);
  items = signal<ServiceOffering[]>([]);

  ngOnInit() { this.svc.getServices().subscribe(x => this.items.set(x)); }

  mapIcon(name?: string): string {
    const m: Record<string,string> = {
      video: 'fa-video', activity: 'fa-heart-pulse',
      presentation: 'fa-chalkboard-user', 'graduation-cap': 'fa-graduation-cap'
    };
    return m[name || ''] || 'fa-briefcase';
  }
}
