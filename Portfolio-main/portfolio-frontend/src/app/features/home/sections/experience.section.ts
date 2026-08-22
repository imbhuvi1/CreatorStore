import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Experience } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Experience &amp; Training</h2>
      <ol class="timeline">
        @for (e of items(); track e.id) {
          <li class="node" appReveal [attr.data-testid]="'experience-' + e.id">
            <div class="dot"></div>
            <div class="card body">
              <div class="head">
                <div>
                  <h3>{{ e.role }}</h3>
                  <p class="org">{{ e.organization }} @if (e.location) { <span class="muted">· {{ e.location }}</span> }</p>
                </div>
                <span class="badge">{{ e.duration }}</span>
              </div>
              @if (e.responsibilities) { <p class="resp">{{ e.responsibilities }}</p> }
              @if (e.technologies) {
                <div class="tech">
                  @for (t of e.technologies.split(','); track t) { <span class="badge">{{ t.trim() }}</span> }
                </div>
              }
              @if (e.achievements) { <p class="ach"><i class="fa-solid fa-award"></i> {{ e.achievements }}</p> }
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  styles: [`
    .timeline { list-style: none; padding: 0; margin: 32px 0 0; position: relative; }
    .timeline::before {
      content: ''; position: absolute; left: 18px; top: 8px; bottom: 8px;
      width: 2px; background: linear-gradient(to bottom, var(--accent), var(--accent-2));
      opacity: .35;
    }
    .node { display: flex; gap: 24px; margin-bottom: 24px; position: relative; }
    .dot {
      width: 14px; height: 14px; border-radius: 50%; margin-top: 26px;
      background: var(--accent); box-shadow: 0 0 0 5px rgba(125,211,252,0.15); flex-shrink: 0;
      margin-left: 12px;
    }
    .body { flex: 1; }
    .head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; }
    .org { margin: 4px 0 0; color: var(--text-dim); font-size: .95rem; }
    .muted { color: var(--text-dim); }
    .resp { margin: 8px 0; }
    .tech { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
    .ach { color: var(--success); margin-top: 8px; font-size: .92rem; }
  `]
})
export class ExperienceSection implements OnInit {
  private svc = inject(PortfolioService);
  items = signal<Experience[]>([]);
  ngOnInit() { this.svc.getExperience().subscribe(x => this.items.set(x)); }
}
