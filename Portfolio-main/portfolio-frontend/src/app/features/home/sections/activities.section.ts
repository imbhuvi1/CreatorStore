import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Activity } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Extracurricular Activities</h2>
      <div class="grid">
        @for (a of items(); track a.id) {
          <article class="card" appReveal [attr.data-testid]="'activity-' + a.id">
            <div class="ico"><i class="fa-solid fa-users"></i></div>
            <h3>{{ a.title }}</h3>
            <span class="badge">{{ a.activityDate }} · {{ a.organization }}</span>
            <p>{{ a.description }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .ico {
      width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
      background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(125,211,252,0.2));
      color: var(--success); font-size: 1.3rem; margin-bottom: 10px;
    }
  `]
})
export class ActivitiesSection implements OnInit {
  private svc = inject(PortfolioService);
  items = signal<Activity[]>([]);
  ngOnInit() { this.svc.getActivities().subscribe(x => this.items.set(x)); }
}
