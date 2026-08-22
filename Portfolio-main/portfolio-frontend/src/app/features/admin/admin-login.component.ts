import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="wrap">
      <div class="card panel">
        <div class="head">
          <div class="lock"><i class="fa-solid fa-lock"></i></div>
          <h1>Admin Access</h1>
          <p class="muted">Manage projects, messages, and analytics.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>
            <span>Username</span>
            <input formControlName="username" autocomplete="username" data-testid="admin-username">
          </label>
          <label>
            <span>Password</span>
            <input formControlName="password" type="password" autocomplete="current-password" data-testid="admin-password">
          </label>
          @if (error()) { <div class="err" data-testid="login-error">{{ error() }}</div> }
          <button type="submit" class="btn primary" [disabled]="loading() || form.invalid" data-testid="admin-login-btn">
            @if (loading()) { <i class="fa-solid fa-spinner fa-spin"></i> Signing in... }
            @else { <i class="fa-solid fa-right-to-bracket"></i> Sign in }
          </button>
        </form>

        <a class="back" routerLink="/"><i class="fa-solid fa-arrow-left"></i> Back to portfolio</a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .wrap { min-height: 100vh; display: grid; place-items: center; padding: 40px 20px;
      background:
        radial-gradient(circle at 20% 20%, rgba(125,211,252,0.18), transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(167,139,250,0.18), transparent 55%),
        var(--bg-0);
    }
    .panel { width: 100%; max-width: 420px; padding: 36px; }
    .head { text-align: center; margin-bottom: 24px; }
    .lock {
      width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      display: grid; place-items: center; font-size: 1.4rem; color: var(--bg-0);
    }
    h1 { font-size: 1.5rem; margin: 0 0 6px; }
    form { display: flex; flex-direction: column; gap: 14px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: .88rem; color: var(--text-dim); }
    input { padding: 12px 14px; border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.04); border: 1px solid var(--card-border);
      color: var(--text); font-family: inherit; }
    input:focus { outline: none; border-color: var(--accent); }
    .err { color: var(--error); font-size: .88rem; }
    .back { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; font-size: .88rem; color: var(--text-dim); }
    .back:hover { color: var(--accent); }
  `]
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  loading = signal(false);
  error = signal<string | null>(null);

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true); this.error.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => { this.loading.set(false); this.router.navigateByUrl('/admin'); },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
