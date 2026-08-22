import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { BlogPost } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container page">
      @if (loading()) { <div class="skeleton" style="height:400px;max-width:760px;margin:0 auto;"></div> }
      @else if (error()) {
        <div class="card empty">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>{{ error() }}</p>
          <a class="btn ghost" routerLink="/blog"><i class="fa-solid fa-arrow-left"></i> Back to blog</a>
        </div>
      }
      @else if (post()) {
        @let p = post()!;
        <article class="post">
          <a class="btn ghost back" routerLink="/blog"><i class="fa-solid fa-arrow-left"></i> All posts</a>
          <div class="tags">
            @for (t of tagList(p.tags); track t) { <span class="badge">{{ t }}</span> }
          </div>
          <h1>{{ p.title }}</h1>
          <div class="meta">
            <span>{{ p.publishedAt | date:'longDate' }}</span>
            <span>· {{ p.readMinutes }} min read</span>
          </div>
          <div class="content" [innerHTML]="renderedContent()"></div>
        </article>
      }
    </main>
  `,
  styles: [`
    .page { padding: 120px 0 80px; }
    .post { max-width: 760px; margin: 0 auto; }
    .back { margin-bottom: 24px; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin: 8px 0 12px; }
    .meta { display: flex; gap: 8px; color: var(--text-dim); font-family: var(--font-mono); font-size: .88rem; margin-bottom: 36px; }
    .content { color: var(--text); font-size: 1.05rem; line-height: 1.75; }
    .content :where(h2) { font-family: var(--font-display); font-size: 1.6rem; margin: 32px 0 12px; }
    .content :where(h3) { font-family: var(--font-display); font-size: 1.3rem; margin: 24px 0 8px; }
    .content :where(p) { color: var(--text); margin: 0 0 16px; }
    .content :where(ul, ol) { padding-left: 24px; margin: 0 0 16px; }
    .content :where(code) { font-family: var(--font-mono); font-size: .92rem;
      background: rgba(125,211,252,0.1); border: 1px solid var(--card-border);
      padding: 2px 6px; border-radius: 6px; color: var(--accent); }
    .content :where(pre) { background: var(--bg-1); border: 1px solid var(--card-border);
      border-radius: 12px; padding: 16px; overflow-x: auto; margin: 20px 0;
      font-family: var(--font-mono); font-size: .9rem; line-height: 1.55; }
    .content :where(pre code) { background: transparent; border: none; padding: 0; color: var(--text); }
    .content :where(a) { color: var(--accent); text-decoration: underline; }
    .empty { text-align: center; padding: 60px; max-width: 500px; margin: 0 auto; }
    .empty i { display: block; font-size: 2rem; margin-bottom: 10px; color: var(--error); }
  `]
})
export class BlogPostComponent implements OnInit {
  private svc = inject(PortfolioService);
  private route = inject(ActivatedRoute);

  post = signal<BlogPost | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  renderedContent = signal<string>('');

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.svc.getBlogPost(slug).subscribe({
      next: p => {
        this.post.set(p);
        this.renderedContent.set(this.renderMarkdown(p.content));
        this.loading.set(false);
      },
      error: () => { this.error.set('Post not found or not published yet.'); this.loading.set(false); }
    });
  }

  tagList(t?: string) { return (t || '').split(',').map(s => s.trim()).filter(Boolean); }

  /** Minimal safe markdown renderer — headings, paragraphs, code fences, inline code,
   *  bold/italic, unordered lists, links. Escapes HTML first so user content is safe. */
  private renderMarkdown(md: string): string {
    let s = this.escapeHtml(md);
    // fenced code blocks
    s = s.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`);
    // headings (### / ## / #)
    s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // inline code
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    // bold **x** and italic *x*
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
    // links [text](url) — enforce http(s)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // unordered lists
    s = s.replace(/(^|\n)((?:- [^\n]+\n?)+)/g, (_, lead, block) => {
      const items = block.trim().split(/\n/).map((l: string) => l.replace(/^- /, '')).map((i: string) => `<li>${i}</li>`).join('');
      return `${lead}<ul>${items}</ul>`;
    });
    // paragraphs — split on blank lines
    s = s.split(/\n{2,}/).map(block => {
      if (/^\s*<(h1|h2|h3|ul|ol|pre|blockquote)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
    return s;
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
