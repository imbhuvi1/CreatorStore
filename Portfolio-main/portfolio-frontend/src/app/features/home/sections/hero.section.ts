import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section class="hero grid-bg">
      <div class="orbs" aria-hidden="true">
        <span class="orb o1"></span>
        <span class="orb o2"></span>
        <span class="orb o3"></span>
      </div>

      <div class="container inner">
        <div class="text" appReveal>
          <!-- <span class="section-eyebrow"></span> -->
          <h1>Hi, I'm <span class="grad">Bhuvnesh Singh Bhadauriya</span></h1>
          <div class="typing" aria-live="polite">
            <span class="prompt">$</span>
            <span class="role" data-testid="hero-role">{{ typed() }}</span><span class="caret"></span>
          </div>
          <p class="lead">
            B.Tech CSE Graduate (2026). Currently training via BridgeLabz for the A4 Analyst role associated with Capgemini.
            I build clean REST APIs with Spring Boot and thoughtful Angular UIs — with a focus on scalable, well-tested code.
          </p>
          <div class="cta">
            <a class="btn primary" href="#projects" data-testid="hero-view-projects">
              <i class="fa-solid fa-code"></i> View Projects
            </a>
            <a class="btn" [href]="'/assets/' + resume" download (click)="onResumeDownload()" data-testid="hero-download-resume">
              <i class="fa-solid fa-download"></i> Download Resume
            </a>
            <a class="btn ghost" href="#contact" data-testid="hero-contact-me">
              <i class="fa-regular fa-paper-plane"></i> Contact Me
            </a>
          </div>

          <div class="meta">
            <span class="badge"><i class="fa-brands fa-java"></i> Java</span>
            <span class="badge">Spring Boot</span>
            <span class="badge">Angular</span>
            <span class="badge">PostgreSQL</span>
            <span class="badge">REST APIs</span>
            <span class="badge">MySQL</span>
          </div>
        </div>

        <div class="avatar-wrap" appReveal>
          <div class="avatar">
            <div class="ring"></div>
            <div class="ring r2"></div>
            <div class="mono">
              <i class="fa-solid fa-user-astronaut"></i>
            </div>
          </div>
          <div class="status">
            <span class="pulse"></span> Open to opportunities
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { padding: 140px 0 120px; overflow: hidden; }
    .inner { display: grid; grid-template-columns: 1.4fr .8fr; gap: 64px; align-items: center; position: relative; z-index: 2; }
    .grad {
      background: linear-gradient(120deg, var(--accent), var(--accent-2));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .typing { font-family: var(--font-mono); font-size: 1.05rem; color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
    .prompt { color: var(--accent); }
    .caret { display: inline-block; width: 8px; height: 18px; background: var(--accent); animation: blink 1s steps(1) infinite; margin-left: 4px; }
    @keyframes blink { 50% { opacity: 0; } }
    .lead { max-width: 640px; font-size: 1.05rem; }
    .cta { display: flex; gap: 12px; flex-wrap: wrap; margin: 26px 0 22px; }
    .meta { display: flex; gap: 8px; flex-wrap: wrap; }

    .orbs .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .55; z-index: 1; }
    .o1 { width: 380px; height: 380px; background: var(--accent); top: -80px; left: -60px; opacity: .25; }
    .o2 { width: 420px; height: 420px; background: var(--accent-2); bottom: -120px; right: -80px; opacity: .3; }
    .o3 { width: 240px; height: 240px; background: var(--accent-3); top: 40%; right: 35%; opacity: .18; }

    .avatar-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .avatar {
      position: relative; width: 260px; height: 260px; border-radius: 50%;
      display: grid; place-items: center;
      background: radial-gradient(circle at 30% 20%, rgba(125,211,252,0.35), transparent 60%),
                  radial-gradient(circle at 80% 80%, rgba(167,139,250,0.35), transparent 60%),
                  var(--bg-1);
      border: 1px solid var(--card-border); box-shadow: var(--shadow);
    }
    .avatar .mono {
      width: 100%; height: 100%; display: grid; place-items: center;
      font-size: 5rem; color: var(--accent);
    }
    .ring, .r2 {
      position: absolute; inset: -14px; border-radius: 50%;
      border: 1px dashed var(--card-border);
      animation: spin 22s linear infinite;
    }
    .r2 { inset: -30px; animation-duration: 40s; animation-direction: reverse; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .status { display: inline-flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: .9rem; }
    .pulse {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--success); box-shadow: 0 0 0 0 var(--success);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(52,211,153,.6); }
      70% { box-shadow: 0 0 0 12px rgba(52,211,153,0); }
      100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
    }

    @media (max-width: 900px) {
      .inner { grid-template-columns: 1fr; }
      .avatar { width: 200px; height: 200px; }
    }
  `]
})
export class HeroSection implements OnInit, OnDestroy {
  private analytics = inject(AnalyticsService);
  resume = environment.resumeFile;

  roles = [
    'Java Full Stack Developer',
    'Spring Boot Engineer',
    'Angular + TypeScript',
    'REST API Designer',
    'PostgreSQL & JPA'
  ];
  typed = signal('');
  private idx = 0;
  private char = 0;
  private timer?: any;
  private erasing = false;

  ngOnInit() {
    this.tick();
    this.analytics.track('page_view');
  }
  ngOnDestroy() { if (this.timer) clearTimeout(this.timer); }

  onResumeDownload() { this.analytics.track('resume_download'); }

  private tick() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typed.set(this.roles[0]);
      return;
    }
    const current = this.roles[this.idx];
    if (!this.erasing) {
      this.char++;
      this.typed.set(current.slice(0, this.char));
      if (this.char >= current.length) {
        this.erasing = true;
        this.timer = setTimeout(() => this.tick(), 1400);
        return;
      }
      this.timer = setTimeout(() => this.tick(), 60);
    } else {
      this.char--;
      this.typed.set(current.slice(0, this.char));
      if (this.char <= 0) {
        this.erasing = false;
        this.idx = (this.idx + 1) % this.roles.length;
      }
      this.timer = setTimeout(() => this.tick(), 30);
    }
  }
}
