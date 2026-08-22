import { Component, inject } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { BackToTopComponent } from './shared/components/back-to-top.component';
import { ToastHostComponent } from './shared/components/toast-host.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, BackToTopComponent, ToastHostComponent],
  template: `
    @if (showChrome()) { <app-navbar></app-navbar> }
    <main>
      <router-outlet></router-outlet>
    </main>
    @if (showChrome()) {
      <app-footer></app-footer>
      <app-back-to-top></app-back-to-top>
    }
    <app-toast-host></app-toast-host>
  `
})
export class AppComponent {
  private theme = inject(ThemeService);
  private router = inject(Router);

  showChrome = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => !this.router.url.startsWith('/admin')),
      startWith(!this.router.url.startsWith('/admin'))
    ),
    { initialValue: true }
  );
}
