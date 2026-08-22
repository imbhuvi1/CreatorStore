import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RevealDirective],
  template: `
    <section class="container" appReveal>
      <span class="section-eyebrow"></span>
      <h2>Let's Build Something</h2>
      <p class="lead">
        Have a role, project, or question? Drop a message below or reach out on WhatsApp.
      </p>

      <div class="grid">
        <form [formGroup]="form" (ngSubmit)="submit()" class="card" novalidate>
          <div class="row">
            <label>
              <span>Name *</span>
              <input formControlName="name" type="text" autocomplete="name" data-testid="contact-name"
                     placeholder="Your full name">
              @if (showErr('name')) { <em class="err">Name is required.</em> }
            </label>
            <label>
              <span>Email *</span>
              <input formControlName="email" type="email" autocomplete="email" data-testid="contact-email"
                     placeholder="you@example.com">
              @if (showErr('email')) { <em class="err">A valid email is required.</em> }
            </label>
          </div>
          <div class="row">
            <label>
              <span>Phone</span>
              <input formControlName="phone" type="tel" autocomplete="tel" data-testid="contact-phone"
                     placeholder="+91 · optional">
              @if (showErr('phone')) { <em class="err">Enter a valid phone number.</em> }
            </label>
            <label>
              <span>Subject *</span>
              <input formControlName="subject" type="text" data-testid="contact-subject"
                     placeholder="What's this about?">
              @if (showErr('subject')) { <em class="err">Subject is required.</em> }
            </label>
          </div>
          <label class="full">
            <span>Message *</span>
            <textarea formControlName="message" rows="6" data-testid="contact-message"
                      placeholder="A few lines about what you're looking for..."></textarea>
            @if (showErr('message')) { <em class="err">Message must be at least 10 characters.</em> }
          </label>

          <div class="actions">
            <button type="submit" class="btn primary" [disabled]="submitting() || form.invalid"
                    data-testid="contact-submit">
              @if (submitting()) { <i class="fa-solid fa-spinner fa-spin"></i> Sending... }
              @else { <i class="fa-solid fa-paper-plane"></i> Send Message }
            </button>
            <a class="btn" [href]="waLink()" target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
          </div>
        </form>

        <aside class="card side">
          <h3>Direct channels</h3>
          <a class="row-link" [href]="'mailto:' + email"><i class="fa-solid fa-envelope"></i> {{ email }}</a>
          <a class="row-link" [href]="waLink()" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
          <p class="muted small">Typical response time: within 24-48 hours.</p>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .lead { max-width: 620px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1.7fr 1fr; gap: 20px; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: .88rem; color: var(--text-dim); }
    label.full { width: 100%; }
    input, textarea {
      width: 100%; padding: 12px 14px; border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.04); border: 1px solid var(--card-border);
      color: var(--text); font-family: inherit; font-size: .95rem;
      transition: border-color .18s ease;
    }
    input:focus, textarea:focus { outline: none; border-color: var(--accent); }
    .err { color: var(--error); font-size: .78rem; font-style: normal; }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .side h3 { font-family: var(--font-mono); font-size: 1rem; color: var(--accent); text-transform: uppercase; letter-spacing: .1em; }
    .row-link { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px dashed var(--card-border); color: var(--text); }
    .row-link:hover { color: var(--accent); }
    .row-link:last-of-type { border-bottom: 0; }
    .muted { color: var(--text-dim); } .small { font-size: .85rem; }
    @media (max-width: 900px) { .grid, .row { grid-template-columns: 1fr; } }
  `]
})
export class ContactSection {
  private fb = inject(FormBuilder);
  private api = inject(ContactService);
  private toast = inject(ToastService);
  submitting = signal(false);
  email = environment.ownerEmail;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(160)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^$|^[+0-9()\-\s]{7,20}$/)]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
  });

  showErr(k: string) {
    const c = this.form.get(k);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.api.submit(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Message sent — check your inbox for a confirmation.', 'success');
        this.form.reset();
        this.submitting.set(false);
      },
      error: err => {
        const msg = err?.error?.message || 'Something went wrong. Please try again later.';
        this.toast.show(msg, 'error');
        this.submitting.set(false);
      }
    });
  }

  waLink(): string {
    const n = (environment.whatsappNumber || '').replace(/\D/g, '');
    const t = encodeURIComponent(environment.whatsappMessage);
    return `https://wa.me/${n || '[YOUR_WHATSAPP_NUMBER]'}?text=${t}`;
  }
}
