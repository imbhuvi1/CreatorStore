import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Project } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Selected Work</h2>
      <p class="lead">Full-stack builds using Java, Spring Boot, Angular, and PostgreSQL.</p>

      <div class="filters" role="tablist">
        @for (c of categories(); track c) {
          <button class="chip" [class.active]="active()===c" (click)="active.set(c)"
                  [attr.data-testid]="'filter-' + c">{{ c }}</button>
        }
      </div>

      @if (loading()) {
        <div class="grid">
          @for (_ of [1,2,3]; track $index) { <div class="skeleton" style="height:280px;"></div> }
        </div>
      } @else if (error()) {
        <div class="card" data-testid="projects-error"><strong>Couldn't load projects.</strong> {{ error() }}</div>
      } @else {
        <div class="grid">
          @for (p of filtered(); track p.id) {
            <article class="card project" appReveal [attr.data-testid]="'project-' + p.id"
                     (click)="trackView(p.id)">
              <div class="thumb" [style.background-image]="p.imageUrl ? 'url(' + p.imageUrl + ')' : ''">
                @if (!p.imageUrl) { <i class="fa-solid fa-code"></i> }
              </div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.description }}</p>
              <div class="tech">
                @for (t of techList(p.technologies); track t) { <span class="badge">{{ t }}</span> }
              </div>
              <div class="actions">
                @if (p.githubUrl) {
                  <a class="btn" [href]="p.githubUrl" target="_blank" rel="noopener noreferrer" (click)="$event.stopPropagation(); trackView(p.id)">
                    <i class="fa-brands fa-github"></i> Code
                  </a>
                }
                @if (p.demoUrl) {
                  <a class="btn ghost" [href]="p.demoUrl" target="_blank" rel="noopener noreferrer" (click)="$event.stopPropagation(); trackView(p.id)">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
                  </a>
                }
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .lead { max-width: 620px; margin-bottom: 32px; }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
    .chip {
      padding: 8px 16px; border-radius: 999px; border: 1px solid var(--card-border);
      background: transparent; color: var(--text-dim); font-family: var(--font-mono); font-size: .82rem;
      transition: all .18s ease;
    }
    .chip:hover, .chip.active { color: var(--accent); border-color: var(--accent); background: rgba(125,211,252,0.08); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .project { display: flex; flex-direction: column; gap: 14px; }
    .thumb {
      aspect-ratio: 16/9; border-radius: var(--radius-sm);
      background-size: cover; background-position: center;
      background-color: var(--bg-2);
      display: grid; place-items: center; font-size: 2.5rem; color: var(--text-dim);
    }
    .tech { display: flex; flex-wrap: wrap; gap: 6px; }
    .actions { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; }
  `]
})
export class ProjectsSection implements OnInit {
  private svc = inject(PortfolioService);
  private analytics = inject(AnalyticsService);
  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  active = signal<string>('All');

  categories = computed(() => {
    const s = new Set<string>(['All']);
    this.projects().forEach(p => p.category && s.add(p.category));
    return Array.from(s);
  });
  filtered = computed(() => {
    const a = this.active();
    return a === 'All' ? this.projects() : this.projects().filter(p => p.category === a);
  });

  ngOnInit() {
    this.svc.getProjects().subscribe({
      next: p => { this.projects.set(p); this.loading.set(false); },
      error: e => { this.error.set(e?.message || 'Network error'); this.loading.set(false); }
    });
  }

  techList(t: string) { return t.split(',').map(s => s.trim()).filter(Boolean); }

  private trackedProjects = new Set<number>();
  trackView(id: number) {
    if (this.trackedProjects.has(id)) return;
    this.trackedProjects.add(id);
    this.analytics.track('project_view', id);
  }
}
