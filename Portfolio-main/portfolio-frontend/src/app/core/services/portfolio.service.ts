import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, PageResponse, Project, Skill, Achievement, Education,
  Experience, Activity, ServiceOffering, SocialLink
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getProjects(category?: string): Observable<Project[]> {
    const params: any = {};
    if (category && category !== 'All') params.category = category;
    return this.http.get<ApiResponse<PageResponse<Project>>>(`${this.base}/projects`, { params })
      .pipe(map(r => r.data.content));
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<ApiResponse<Skill[]>>(`${this.base}/skills`).pipe(map(r => r.data));
  }
  getAchievements(): Observable<Achievement[]> {
    return this.http.get<ApiResponse<Achievement[]>>(`${this.base}/achievements`).pipe(map(r => r.data));
  }
  getEducation(): Observable<Education[]> {
    return this.http.get<ApiResponse<Education[]>>(`${this.base}/education`).pipe(map(r => r.data));
  }
  getExperience(): Observable<Experience[]> {
    return this.http.get<ApiResponse<Experience[]>>(`${this.base}/experience`).pipe(map(r => r.data));
  }
  getActivities(): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.base}/activities`).pipe(map(r => r.data));
  }
  getServices(): Observable<ServiceOffering[]> {
    return this.http.get<ApiResponse<ServiceOffering[]>>(`${this.base}/services`).pipe(map(r => r.data));
  }
  getSocialLinks(): Observable<SocialLink[]> {
    return this.http.get<ApiResponse<SocialLink[]>>(`${this.base}/social-links`).pipe(map(r => r.data));
  }

  getBlogPosts(page = 0, size = 20, search?: string, tag?: string): Observable<import('../models/portfolio.models').BlogPost[]> {
    const params: any = { page, size };
    if (search) params.search = search;
    if (tag) params.tag = tag;
    return this.http.get<ApiResponse<PageResponse<import('../models/portfolio.models').BlogPost>>>(`${this.base}/blog`, { params })
      .pipe(map(r => r.data.content));
  }
  getBlogTags(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.base}/blog/tags`).pipe(map(r => r.data));
  }
  getBlogPost(slug: string): Observable<import('../models/portfolio.models').BlogPost> {
    return this.http.get<ApiResponse<import('../models/portfolio.models').BlogPost>>(`${this.base}/blog/${slug}`).pipe(map(r => r.data));
  }
}
