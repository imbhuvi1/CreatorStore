import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Education } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Education</h2>
      <div class="grid">
        @for (e of items(); track e.id) {
          <article class="card" appReveal [attr.data-testid]="'edu-' + e.id">
            <div class="years"><i class="fa-solid fa-graduation-cap"></i> {{ e.startYear }} — {{ e.endYear }}</div>
            <h3>{{ e.degree }}</h3>
            <p class="inst">{{ e.institution }} @if (e.location) { <span class="muted">· {{ e.location }}</span> }</p>
            @if (e.grade) { <span class="badge">{{ e.grade }}</span> }
            @if (e.description) { <p class="desc">{{ e.description }}</p> }
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .years { font-family: var(--font-mono); font-size: .8rem; color: var(--accent); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 8px; }
    .inst { color: var(--text-dim); margin: 4px 0 10px; }
    .muted { color: var(--text-dim); }
    .desc { margin-top: 10px; font-size: .95rem; }
  `]
})
export class EducationSection implements OnInit {
  private svc = inject(PortfolioService);
  items = signal<Education[]>([]);
  ngOnInit() { this.svc.getEducation().subscribe(x => this.items.set(x)); }
}
