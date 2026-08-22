import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-host" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class.success]="t.type==='success'" [class.error]="t.type==='error'"
             (click)="toast.dismiss(t.id)" data-testid="toast">
          {{ t.message }}
        </div>
      }
    </div>
  `
})
export class ToastHostComponent {
  toast = inject(ToastService);
}
