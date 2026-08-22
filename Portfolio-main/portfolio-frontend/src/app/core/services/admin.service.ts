import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, PageResponse, Project, Skill, Achievement,
  Education, Experience, Activity, ServiceOffering, SocialLink
} from '../models/portfolio.models';

export interface AdminMessage {
  id: number; name: string; email: string; phone?: string;
  subject: string; message: string; isRead: boolean; createdAt: string;
}

export interface AnalyticsSummary {
  pageViews: number; resumeDownloads: number; projectViews: number;
  perProject: { projectId: number; views: number }[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/admin`;

  messages(page = 0, size = 20): Observable<{ content: AdminMessage[]; totalElements: number; totalPages: number }> {
    return this.http.get<ApiResponse<PageResponse<AdminMessage>>>(`${this.base}/messages`, { params: { page, size } })
      .pipe(map(r => r.data));
  }
  markRead(id: number) { return this.http.patch<ApiResponse<AdminMessage>>(`${this.base}/messages/${id}/read`, {}); }
  deleteMessage(id: number) { return this.http.delete<ApiResponse<void>>(`${this.base}/messages/${id}`); }

  analytics(): Observable<AnalyticsSummary> {
    return this.http.get<ApiResponse<AnalyticsSummary>>(`${environment.apiUrl}/analytics/summary`).pipe(map(r => r.data));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post<ApiResponse<void>>(`${this.base}/change-password`, { currentPassword, newPassword });
  }

  sendDigestNow() {
    return this.http.post<ApiResponse<void>>(`${this.base}/digest/send-now`, {});
  }

  /* Generic CRUD helpers — one path per section */
  create<T>(path: string, body: Partial<T>) {
    return this.http.post<ApiResponse<T>>(`${this.base}/${path}`, body);
  }
  update<T>(path: string, id: number, body: Partial<T>) {
    return this.http.put<ApiResponse<T>>(`${this.base}/${path}/${id}`, body);
  }
  remove(path: string, id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${path}/${id}`);
  }

  // Typed convenience wrappers used across the dashboard
  createProject(p: Partial<Project>) { return this.create<Project>('projects', p); }
  updateProject(id: number, p: Partial<Project>) { return this.update<Project>('projects', id, p); }
  deleteProject(id: number) { return this.remove('projects', id); }

  createSkill(s: Partial<Skill>) { return this.create<Skill>('skills', s); }
  updateSkill(id: number, s: Partial<Skill>) { return this.update<Skill>('skills', id, s); }
  deleteSkill(id: number) { return this.remove('skills', id); }

  createAchievement(a: Partial<Achievement>) { return this.create<Achievement>('achievements', a); }
  updateAchievement(id: number, a: Partial<Achievement>) { return this.update<Achievement>('achievements', id, a); }
  deleteAchievement(id: number) { return this.remove('achievements', id); }

  createEducation(e: Partial<Education>) { return this.create<Education>('education', e); }
  updateEducation(id: number, e: Partial<Education>) { return this.update<Education>('education', id, e); }
  deleteEducation(id: number) { return this.remove('education', id); }

  createExperience(x: Partial<Experience>) { return this.create<Experience>('experience', x); }
  updateExperience(id: number, x: Partial<Experience>) { return this.update<Experience>('experience', id, x); }
  deleteExperience(id: number) { return this.remove('experience', id); }

  createActivity(a: Partial<Activity>) { return this.create<Activity>('activities', a); }
  updateActivity(id: number, a: Partial<Activity>) { return this.update<Activity>('activities', id, a); }
  deleteActivity(id: number) { return this.remove('activities', id); }

  createService(s: Partial<ServiceOffering>) { return this.create<ServiceOffering>('services', s); }
  updateService(id: number, s: Partial<ServiceOffering>) { return this.update<ServiceOffering>('services', id, s); }
  deleteService(id: number) { return this.remove('services', id); }

  createSocial(s: Partial<SocialLink>) { return this.create<SocialLink>('social-links', s); }
  updateSocial(id: number, s: Partial<SocialLink>) { return this.update<SocialLink>('social-links', id, s); }
  deleteSocial(id: number) { return this.remove('social-links', id); }

  /* Blog CRUD */
  listBlog() {
    return this.http.get<ApiResponse<import('../models/portfolio.models').BlogPost[]>>(`${this.base}/blog`).pipe(map(r => r.data));
  }
  createBlog(b: Partial<import('../models/portfolio.models').BlogPost>) { return this.create<import('../models/portfolio.models').BlogPost>('blog', b); }
  updateBlog(id: number, b: Partial<import('../models/portfolio.models').BlogPost>) { return this.update<import('../models/portfolio.models').BlogPost>('blog', id, b); }
  deleteBlog(id: number) { return this.remove('blog', id); }
}
