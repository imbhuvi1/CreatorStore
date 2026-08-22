import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container inner">
        <div>
          <div class="brand">Bhuvnesh Singh Bhadauriya</div>
          <p class="muted">Java Full Stack Developer · B.Tech CSE'26</p>
        </div>
        <div class="muted small">
          &copy; {{ year }} Bhuvnesh — Built with Angular &amp; Spring Boot.
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { border-top: 1px solid var(--card-border); padding: 32px 0; margin-top: 40px; background: var(--bg-1); }
    .inner { display: flex; justify-content: space-between; gap: 24px; flex-wrap: wrap; align-items: center; }
    .brand { font-family: var(--font-mono); font-weight: 700; }
    .muted { color: var(--text-dim); margin: 4px 0; }
    .small { font-size: .85rem; }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
  env = environment;
}
