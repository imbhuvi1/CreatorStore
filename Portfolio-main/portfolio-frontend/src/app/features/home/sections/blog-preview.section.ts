import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { BlogPost } from '../../../core/models/portfolio.models';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-blog-preview',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  template: `
    @if (posts().length > 0) {
      <section class="container" appReveal>
        <div class="head">
          <div>
            <span class="section-eyebrow"></span>
            <h2>Recent notes</h2>
            <p class="lead">Short posts on Java, Spring, Angular, and things I learn while shipping.</p>
          </div>
          <a class="btn ghost" routerLink="/blog" data-testid="blog-view-all">All posts <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="grid">
          @for (p of posts(); track p.id) {
            <a class="card post" [routerLink]="['/blog', p.slug]" [attr.data-testid]="'blog-post-' + p.slug">
              <div class="tags">
                @for (t of tagList(p.tags); track t) { <span class="badge">{{ t }}</span> }
              </div>
              <h3>{{ p.title }}</h3>
              <p class="excerpt">{{ p.excerpt || previewOf(p.content) }}</p>
              <div class="meta">
                <span>{{ p.publishedAt | date:'mediumDate' }}</span>
                <span>· {{ p.readMinutes }} min read</span>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
    .lead { max-width: 620px; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .post { display: flex; flex-direction: column; gap: 10px; text-decoration: none; color: inherit; }
    .post h3 { margin: 0; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .excerpt { color: var(--text-dim); flex: 1; }
    .meta { display: flex; gap: 6px; color: var(--text-dim); font-family: var(--font-mono); font-size: .78rem; margin-top: 6px; }
  `]
})
export class BlogPreviewSection implements OnInit {
  private svc = inject(PortfolioService);
  posts = signal<BlogPost[]>([]);

  ngOnInit() {
    this.svc.getBlogPosts(0, 3).subscribe({
      next: p => this.posts.set(p),
      error: () => this.posts.set([])
    });
  }

  tagList(t?: string) { return (t || '').split(',').map(s => s.trim()).filter(Boolean); }
  previewOf(content: string): string {
    const plain = content.replace(/[#*`_>]/g, '').replace(/\s+/g, ' ').trim();
    return plain.length > 160 ? plain.slice(0, 160) + '…' : plain;
  }
}
