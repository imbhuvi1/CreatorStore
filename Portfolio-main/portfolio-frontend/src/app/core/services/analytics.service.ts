import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  track(type: 'page_view' | 'resume_download' | 'project_view', resourceId?: number) {
    // Fire-and-forget; never block UI on analytics.
    const params: any = {};
    if (resourceId != null) params.resourceId = resourceId;
    this.http.post(`${environment.apiUrl}/analytics/${type}`, {}, { params }).subscribe({
      next: () => {}, error: () => {}
    });
  }
}
