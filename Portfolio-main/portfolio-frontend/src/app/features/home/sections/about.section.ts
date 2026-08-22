import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>About Me</h2>
      <div class="grid">
        <div class="card">
          <p>
            I am a B.Tech Computer Science and Engineering graduate from the 2026 batch, currently undergoing
            training via <strong>BridgeLabz</strong> for the <strong>A4 Analyst</strong> role associated with
            <strong>Capgemini</strong>. My focus is on Java backend engineering with Spring Boot and building
            responsive Angular front-ends on top of well-designed REST APIs.
          </p>
          @if (expanded()) {
            <p>
              I care about writing clean, layered code - DTOs at API boundaries, proper transactions, meaningful HTTP
              semantics, and tests around the parts that matter. I like turning small ideas into shipped tools:
              CRUD dashboards, side-project APIs, or utilities that make daily work smoother.
            </p>
            <p>
              My goal is to grow as a full-stack engineer who can own a feature end-to-end - from schema design and
              REST contracts to accessible UI and deployment. I'm actively looking for opportunities where I can
              contribute meaningfully and keep sharpening my fundamentals.
            </p>
          }
          <button class="btn ghost" (click)="expanded.set(!expanded())" data-testid="about-read-more">
            {{ expanded() ? 'Show less' : 'Read more' }}
            <i class="fa-solid" [class.fa-chevron-up]="expanded()" [class.fa-chevron-down]="!expanded()"></i>
          </button>
        </div>

        <aside class="card facts">
          <div class="fact"><span class="k">Degree</span><span class="v">B.Tech CSE, 2026</span></div>
          <div class="fact"><span class="k">Training</span><span class="v">via BridgeLabz - Java Full Stack</span></div>
          <div class="fact"><span class="k">Role Track</span><span class="v">A4 Analyst · Capgemini (in training)</span></div>
          <div class="fact"><span class="k">Focus</span><span class="v">Spring Boot · Angular · PostgreSQL</span></div>
          <div class="fact"><span class="k">Location</span><span class="v">Bareilly, India</span></div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
    .facts { display: grid; gap: 12px; align-content: start; }
    .fact { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px dashed var(--card-border); }
    .fact:last-child { border-bottom: 0; }
    .k { color: var(--text-dim); font-family: var(--font-mono); font-size: .82rem; text-transform: uppercase; letter-spacing: .1em; }
    .v { color: var(--text); font-weight: 600; text-align: right; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `]
})
export class AboutSection { expanded = signal(false); }
