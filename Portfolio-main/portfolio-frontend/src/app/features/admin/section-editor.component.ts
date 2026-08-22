import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/portfolio.models';
import { ToastService } from '../../core/services/toast.service';

export interface FieldSpec {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'url' | 'email';
  placeholder?: string;
  hint?: string;
}

/**
 * Generic inline CRUD editor for a portfolio section.
 * Handles: list existing items with expand-to-edit, add-new form, delete.
 */
@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="section-editor">
      <div class="head">
        <div>
          <h2>{{ title }}</h2>
          <p class="muted">{{ subtitle }}</p>
        </div>
        <button class="btn primary" (click)="startCreate()" [attr.data-testid]="'add-' + testKey">
          <i class="fa-solid fa-plus"></i> Add
        </button>
      </div>

      @if (creating()) {
        <div class="card row-card create">
          <h3>New {{ singular }}</h3>
          <div class="fields">
            @for (f of fields; track f.name) {
              @if (f.type === 'textarea') {
                <label class="full">
                  <span>{{ f.label }}</span>
                  <textarea [(ngModel)]="draft[f.name]" rows="3" [placeholder]="f.placeholder || ''"
                            [attr.data-testid]="'field-new-' + f.name"></textarea>
                  @if (f.hint) { <em class="hint">{{ f.hint }}</em> }
                </label>
              } @else {
                <label>
                  <span>{{ f.label }}</span>
                  <input [(ngModel)]="draft[f.name]" [type]="f.type || 'text'"
                         [placeholder]="f.placeholder || ''"
                         [attr.data-testid]="'field-new-' + f.name">
                  @if (f.hint) { <em class="hint">{{ f.hint }}</em> }
                </label>
              }
            }
          </div>
          <div class="actions">
            <button class="btn ghost" (click)="creating.set(false)" data-testid="cancel-create">Cancel</button>
            <button class="btn primary" (click)="save(null)" [disabled]="saving()" data-testid="save-create">
              @if (saving()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-check"></i> }
              Create
            </button>
          </div>
        </div>
      }

      @if (items.length === 0 && !creating()) {
        <div class="card empty"><i class="fa-solid fa-inbox"></i> No {{ title.toLowerCase() }} yet — click Add to create the first one.</div>
      }

      <div class="list">
        @for (item of items; track item.id; let i = $index) {
          <div class="card row-card" [attr.data-testid]="testKey + '-row-' + item.id">
            <div class="row-head">
              <div class="preview">
                <strong>{{ item[titleField] || '(untitled)' }}</strong>
                @if (subtitleField && item[subtitleField]) {
                  <span class="muted"> · {{ item[subtitleField] }}</span>
                }
              </div>
              <div class="row-actions">
                @if (editingId() === item.id) {
                  <button class="btn primary" (click)="save(item)" [disabled]="saving()" [attr.data-testid]="'save-' + item.id">
                    @if (saving()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-check"></i> } Save
                  </button>
                  <button class="btn ghost" (click)="cancelEdit()" [attr.data-testid]="'cancel-' + item.id">Cancel</button>
                } @else {
                  <button class="btn ghost" (click)="startEdit(item)" [attr.data-testid]="'edit-' + item.id">
                    <i class="fa-solid fa-pen"></i> Edit
                  </button>
                  <button class="btn" (click)="del(item)" [attr.data-testid]="'del-' + item.id">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                }
              </div>
            </div>
            @if (editingId() === item.id) {
              <div class="fields">
                @for (f of fields; track f.name) {
                  @if (f.type === 'textarea') {
                    <label class="full">
                      <span>{{ f.label }}</span>
                      <textarea [(ngModel)]="drafts[item.id][f.name]" rows="3"
                                [placeholder]="f.placeholder || ''"
                                [attr.data-testid]="'field-' + item.id + '-' + f.name"></textarea>
                    </label>
                  } @else {
                    <label>
                      <span>{{ f.label }}</span>
                      <input [(ngModel)]="drafts[item.id][f.name]" [type]="f.type || 'text'"
                             [placeholder]="f.placeholder || ''"
                             [attr.data-testid]="'field-' + item.id + '-' + f.name">
                    </label>
                  }
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
    .head h2 { margin: 0 0 4px; font-size: 1.6rem; }
    .muted { color: var(--text-dim); }
    .empty { text-align: center; padding: 40px; color: var(--text-dim); }
    .empty i { font-size: 2rem; margin-bottom: 8px; display: block; }
    .list, .create { margin-top: 12px; }
    .list { display: flex; flex-direction: column; gap: 12px; }
    .row-card { padding: 18px 20px; }
    .row-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
    .preview strong { font-size: 1.05rem; }
    .row-actions { display: flex; gap: 8px; }
    .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
    .fields .full, .fields textarea { grid-column: 1 / -1; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: .85rem; color: var(--text-dim); }
    input, textarea {
      padding: 10px 12px; border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.04); border: 1px solid var(--card-border);
      color: var(--text); font-family: inherit; font-size: .92rem;
      resize: vertical;
    }
    input:focus, textarea:focus { outline: none; border-color: var(--accent); }
    .hint { color: var(--text-dim); font-size: .74rem; font-style: normal; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
    .create h3 { margin: 0 0 12px; }
    @media (max-width: 720px) { .fields { grid-template-columns: 1fr; } }
  `]
})
export class SectionEditorComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input({ required: true }) singular!: string;
  @Input({ required: true }) testKey!: string;
  @Input({ required: true }) items: any[] = [];
  @Input({ required: true }) fields: FieldSpec[] = [];
  @Input({ required: true }) titleField!: string;
  @Input() subtitleField?: string;

  // Callers pass observable factories so the editor stays generic.
  @Input({ required: true }) onCreate!: (body: any) => Observable<ApiResponse<any>>;
  @Input({ required: true }) onUpdate!: (id: number, body: any) => Observable<ApiResponse<any>>;
  @Input({ required: true }) onDelete!: (id: number) => Observable<ApiResponse<any>>;

  @Output() changed = new EventEmitter<void>();

  private toast = inject(ToastService);

  creating = signal(false);
  saving = signal(false);
  editingId = signal<number | null>(null);
  draft: any = {};
  drafts: Record<number, any> = {};

  startCreate() {
    this.draft = { displayOrder: (this.items.length + 1) };
    this.creating.set(true);
  }
  startEdit(item: any) {
    this.drafts[item.id] = { ...item };
    this.editingId.set(item.id);
  }
  cancelEdit() { this.editingId.set(null); }

  save(item: any | null) {
    this.saving.set(true);
    const done = () => {
      this.saving.set(false);
      this.creating.set(false);
      this.editingId.set(null);
      this.changed.emit();
    };
    const err = (e: any) => {
      this.saving.set(false);
      this.toast.show(e?.error?.message || 'Save failed', 'error');
    };
    if (item === null) {
      this.onCreate(this.normalize(this.draft)).subscribe({ next: r => { this.toast.show(`${this.singular} created`, 'success'); done(); }, error: err });
    } else {
      const body = this.normalize(this.drafts[item.id]);
      this.onUpdate(item.id, body).subscribe({ next: () => { this.toast.show(`${this.singular} updated`, 'success'); done(); }, error: err });
    }
  }

  del(item: any) {
    if (!confirm(`Delete "${item[this.titleField] || 'this item'}"?`)) return;
    this.onDelete(item.id).subscribe({
      next: () => { this.toast.show(`${this.singular} deleted`, 'success'); this.changed.emit(); },
      error: e => this.toast.show(e?.error?.message || 'Delete failed', 'error')
    });
  }

  private normalize(v: any): any {
    // coerce numeric fields
    const out: any = { ...v };
    if (out.displayOrder !== undefined && out.displayOrder !== null && out.displayOrder !== '') {
      out.displayOrder = Number(out.displayOrder);
    }
    return out;
  }
}
