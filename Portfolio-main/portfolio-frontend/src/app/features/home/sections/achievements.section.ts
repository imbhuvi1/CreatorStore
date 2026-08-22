import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Achievement } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Achievements &amp; Certifications</h2>
      <div class="grid">
        @for (a of items(); track a.id) {
          <article class="card" appReveal [attr.data-testid]="'achievement-' + a.id">
            <div class="ico"><i class="fa-solid fa-trophy"></i></div>
            <h3>{{ a.title }}</h3>
            <span class="badge">{{ a.achievedOn }}</span>
            <p>{{ a.description }}</p>
            @if (a.proofUrl && a.proofUrl !== '[CERT_URL]' && a.proofUrl !== '[REPO_URL]' && a.proofUrl !== '[CONTEST_URL]') {
              <a class="btn ghost" [href]="a.proofUrl" target="_blank" rel="noopener noreferrer">
                <i class="fa-solid fa-external-link"></i> View proof
              </a>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .ico {
      width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
      background: linear-gradient(135deg, rgba(125,211,252,0.2), rgba(167,139,250,0.2));
      color: var(--accent); font-size: 1.3rem; margin-bottom: 10px;
    }
  `]
})
export class AchievementsSection implements OnInit {
  private svc = inject(PortfolioService);
  items = signal<Achievement[]>([]);
  ngOnInit() { this.svc.getAchievements().subscribe(x => this.items.set(x)); }
}
