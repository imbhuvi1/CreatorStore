import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Skill } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Skills &amp; Tooling</h2>
      <div class="cats">
        @for (cat of grouped(); track cat.name) {
          <div class="card cat" appReveal>
            <h3>{{ cat.name }}</h3>
            <ul class="chips">
              @for (s of cat.items; track s.id) {
                <li class="chip" [attr.data-testid]="'skill-' + s.id">
                  <span class="name">{{ s.name }}</span>
                  <span class="level" [attr.data-level]="s.level.toLowerCase()">{{ s.level }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .cats { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .cat h3 { font-family: var(--font-mono); font-size: 1rem; color: var(--accent); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 16px; }
    .chips { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; border-radius: 999px;
      background: rgba(255,255,255,0.04); border: 1px solid var(--card-border);
      font-size: .9rem;
    }
    .level {
      font-family: var(--font-mono); font-size: .68rem;
      padding: 2px 8px; border-radius: 999px;
      background: rgba(125,211,252,0.15); color: var(--accent);
    }
    .level[data-level="proficient"] { background: rgba(52,211,153,0.15); color: var(--success); }
    .level[data-level="familiar"] { background: rgba(167,139,250,0.15); color: var(--accent-2); }
  `]
})
export class SkillsSection implements OnInit {
  private svc = inject(PortfolioService);
  skills = signal<Skill[]>([]);
  grouped = computed(() => {
    const map = new Map<string, Skill[]>();
    this.skills().forEach(s => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    });
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  });

  ngOnInit() { this.svc.getSkills().subscribe(s => this.skills.set(s)); }
}
