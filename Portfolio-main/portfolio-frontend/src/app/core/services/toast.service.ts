import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 1;

  show(message: string, type: Toast['type'] = 'info', timeoutMs = 4000) {
    const t: Toast = { id: this.nextId++, message, type };
    this.toasts.update(list => [...list, t]);
    setTimeout(() => this.dismiss(t.id), timeoutMs);
  }
  dismiss(id: number) { this.toasts.update(list => list.filter(t => t.id !== id)); }
}
