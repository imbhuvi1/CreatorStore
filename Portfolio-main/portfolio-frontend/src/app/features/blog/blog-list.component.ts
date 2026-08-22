import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PortfolioService } from '../../core/services/portfolio.service';
import { BlogPost } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container page">
      <header class="hero">
        <span class="section-eyebrow">// blog</span>
        <h1>Writing</h1>
        <p class="lead">Short technical write-ups. Search or filter by topic.</p>
        <a class="btn ghost" routerLink="/"><i class="fa-solid fa-arrow-left"></i> Back to portfolio</a>
      </header>

      <div class="controls">
        <div class="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input [(ngModel)]="query"
                 (ngModelChange)="onSearch($event)"
                 placeholder="Search post titles..."
                 aria-label="Search posts"
                 data-testid="blog-search">
          @if (query) {
            <button class="clear" (click)="clearSearch()" aria-label="Clear search" data-testid="blog-search-clear">
              <i class="fa-solid fa-xmark"></i>
            </button>
          }
        </div>

        @if (tags().length > 0) {
          <div class="tag-chips" role="tablist" aria-label="Filter by tag">
            <button class="chip" [class.active]="!activeTag()" (click)="setTag(null)" data-testid="tag-all">All</button>
            @for (t of tags(); track t) {
              <button class="chip" [class.active]="activeTag() === t" (click)="setTag(t)"
                      [attr.data-testid]="'tag-' + t.toLowerCase().replace(' ', '-')">{{ t }}</button>
            }
          </div>
        }
      </div>

      @if (loading()) { <div class="skeleton" style="height:400px;"></div> }
      @else if (posts().length === 0) {
        <div class="card empty">
          <i class="fa-solid fa-pen-nib"></i>
          @if (query || activeTag()) {
            <p>No posts match your search.</p>
            <button class="btn ghost" (click)="resetFilters()" data-testid="blog-reset">Reset filters</button>
          } @else {
            <p>No published posts yet. Check back soon.</p>
          }
        </div>
      }
      @else {
        <div class="results-count" data-testid="blog-results-count">
          {{ posts().length }} {{ posts().length === 1 ? 'post' : 'posts' }}
          @if (activeTag()) { tagged <strong>{{ activeTag() }}</strong> }
          @if (query) { matching <strong>"{{ query }}"</strong> }
        </div>
        <div class="grid">
          @for (p of posts(); track p.id) {
            <a class="card post" [routerLink]="['/blog', p.slug]" [attr.data-testid]="'blog-item-' + p.slug">
              <div class="tags">
                @for (t of tagList(p.tags); track t) {
                  <span class="badge clickable" (click)="tagClick($event, t)">{{ t }}</span>
                }
              </div>
              <h2>{{ p.title }}</h2>
              <p class="excerpt">{{ p.excerpt || previewOf(p.content) }}</p>
              <div class="meta">
                <span>{{ p.publishedAt | date:'mediumDate' }}</span>
                <span>· {{ p.readMinutes }} min read</span>
                <span class="arrow">Read <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </a>
          }
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: 120px 0 80px; }
    .hero { margin-bottom: 32px; }
    .hero .lead { max-width: 620px; margin: 8px 0 20px; color: var(--text-dim); }

    .controls { display: flex; flex-direction: column; gap: 14px; max-width: 780px; margin-bottom: 24px; }
    .search {
      position: relative;
      display: flex; align-items: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--card-border);
      border-radius: 999px;
      padding: 4px 4px 4px 18px;
      transition: border-color .18s ease;
    }
    .search:focus-within { border-color: var(--accent); }
    .search i.fa-magnifying-glass { color: var(--text-dim); font-size: .95rem; }
    .search input {
      flex: 1; background: transparent; border: none; outline: none; color: var(--text);
      font-family: inherit; font-size: .95rem;
      padding: 10px 12px;
    }
    .clear {
      width: 32px; height: 32px; border-radius: 50%; border: none;
      background: rgba(255,255,255,0.06); color: var(--text-dim); cursor: pointer;
      display: grid; place-items: center;
    }
    .clear:hover { background: rgba(255,255,255,0.12); color: var(--text); }

    .tag-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      padding: 6px 14px; border-radius: 999px; border: 1px solid var(--card-border);
      background: transparent; color: var(--text-dim); font-family: var(--font-mono); font-size: .78rem;
      cursor: pointer; transition: all .18s ease;
    }
    .chip:hover, .chip.active { color: var(--accent); border-color: var(--accent); background: rgba(125,211,252,0.08); }

    .results-count { color: var(--text-dim); font-size: .88rem; max-width: 780px; margin-bottom: 12px; }
    .grid { display: flex; flex-direction: column; gap: 16px; max-width: 780px; }
    .post { display: flex; flex-direction: column; gap: 10px; text-decoration: none; color: inherit; padding: 28px; }
    .post h2 { margin: 6px 0; font-size: 1.5rem; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .badge.clickable { cursor: pointer; transition: all .15s ease; }
    .badge.clickable:hover { color: var(--accent); border-color: var(--accent); }
    .excerpt { color: var(--text-dim); }
    .meta { display: flex; gap: 8px; color: var(--text-dim); font-family: var(--font-mono); font-size: .82rem; align-items: center; }
    .arrow { margin-left: auto; color: var(--accent); }
    .empty { text-align: center; padding: 60px; color: var(--text-dim); max-width: 780px; }
    .empty i { display: block; font-size: 2rem; margin-bottom: 10px; }
  `]
})
export class BlogListComponent implements OnInit {
  private svc = inject(PortfolioService);

  posts = signal<BlogPost[]>([]);
  tags = signal<string[]>([]);
  loading = signal(true);

  query = '';
  activeTag = signal<string | null>(null);

  private search$ = new Subject<{ q: string; tag: string | null }>();

  ngOnInit() {
    this.svc.getBlogTags().subscribe({
      next: t => this.tags.set(t),
      error: () => this.tags.set([])
    });

    this.search$.pipe(
      debounceTime(220),
      distinctUntilChanged((a, b) => a.q === b.q && a.tag === b.tag),
      switchMap(({ q, tag }) => this.svc.getBlogPosts(0, 50, q || undefined, tag || undefined))
    ).subscribe({
      next: p => { this.posts.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });

    this.trigger();
  }

  onSearch(v: string) {
    this.query = v;
    this.trigger();
  }
  setTag(t: string | null) { this.activeTag.set(t); this.trigger(); }
  clearSearch() { this.query = ''; this.trigger(); }
  resetFilters() { this.query = ''; this.activeTag.set(null); this.trigger(); }
  tagClick(event: Event, t: string) {
    event.preventDefault();
    event.stopPropagation();
    this.setTag(t);
  }

  private trigger() {
    this.loading.set(true);
    this.search$.next({ q: this.query, tag: this.activeTag() });
  }

  tagList(t?: string) { return (t || '').split(',').map(s => s.trim()).filter(Boolean); }
  previewOf(content: string): string {
    const plain = content.replace(/[#*`_>]/g, '').replace(/\s+/g, ' ').trim();
    return plain.length > 200 ? plain.slice(0, 200) + '…' : plain;
  }
}
