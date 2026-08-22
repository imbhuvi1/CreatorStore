import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService, AdminMessage, AnalyticsSummary } from '../../core/services/admin.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SectionEditorComponent, FieldSpec } from './section-editor.component';
import {
  Project, Skill, Achievement, Education, Experience,
  Activity, ServiceOffering, SocialLink, BlogPost
} from '../../core/models/portfolio.models';

type Tab = 'overview' | 'messages' | 'projects' | 'skills' | 'achievements' |
           'education' | 'experience' | 'activities' | 'services' | 'social' | 'blog' | 'settings';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SectionEditorComponent],
  template: `
    <div class="wrap">
      <aside class="side">
        <div class="brand">
          <span class="dot"></span>
          <div>
            <div class="name">Admin</div>
            <div class="who">{{ auth.username() }}</div>
          </div>
        </div>
        <nav>
          <button [class.active]="tab()==='overview'" (click)="tab.set('overview')" data-testid="tab-overview"><i class="fa-solid fa-gauge-high"></i> Overview</button>
          <button [class.active]="tab()==='messages'" (click)="tab.set('messages')" data-testid="tab-messages"><i class="fa-solid fa-inbox"></i> Messages
            @if (unreadCount() > 0) { <span class="pill">{{ unreadCount() }}</span> }
          </button>

          <div class="group-label">Content</div>
          <button [class.active]="tab()==='projects'" (click)="tab.set('projects')" data-testid="tab-projects"><i class="fa-solid fa-code"></i> Projects</button>
          <button [class.active]="tab()==='skills'" (click)="tab.set('skills')" data-testid="tab-skills"><i class="fa-solid fa-diagram-project"></i> Skills</button>
          <button [class.active]="tab()==='achievements'" (click)="tab.set('achievements')" data-testid="tab-achievements"><i class="fa-solid fa-trophy"></i> Achievements</button>
          <button [class.active]="tab()==='education'" (click)="tab.set('education')" data-testid="tab-education"><i class="fa-solid fa-graduation-cap"></i> Education</button>
          <button [class.active]="tab()==='experience'" (click)="tab.set('experience')" data-testid="tab-experience"><i class="fa-solid fa-briefcase"></i> Experience</button>
          <button [class.active]="tab()==='activities'" (click)="tab.set('activities')" data-testid="tab-activities"><i class="fa-solid fa-users"></i> Activities</button>
          <button [class.active]="tab()==='services'" (click)="tab.set('services')" data-testid="tab-services"><i class="fa-solid fa-hand-holding-heart"></i> Services</button>
          <button [class.active]="tab()==='social'" (click)="tab.set('social')" data-testid="tab-social"><i class="fa-solid fa-share-nodes"></i> Social</button>
          <button [class.active]="tab()==='blog'" (click)="tab.set('blog')" data-testid="tab-blog"><i class="fa-solid fa-pen-nib"></i> Blog</button>

          <div class="group-label">Account</div>
          <button [class.active]="tab()==='settings'" (click)="tab.set('settings')" data-testid="tab-settings"><i class="fa-solid fa-gear"></i> Settings</button>
        </nav>
        <div class="foot">
          <a routerLink="/" class="link"><i class="fa-solid fa-arrow-up-right-from-square"></i> View site</a>
          <button (click)="signOut()" class="link" data-testid="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Sign out</button>
        </div>
      </aside>

      <main class="main">
        @switch (tab()) {
          @case ('overview') { <ng-container *ngTemplateOutlet="overviewTpl"></ng-container> }
          @case ('messages') { <ng-container *ngTemplateOutlet="messagesTpl"></ng-container> }
          @case ('projects') {
            <app-section-editor title="Projects" subtitle="Showcase items with GitHub / demo links."
              singular="Project" testKey="project" titleField="title" subtitleField="category"
              [items]="projects()" [fields]="projectFields"
              [onCreate]="createProject" [onUpdate]="updateProject" [onDelete]="deleteProject"
              (changed)="reloadProjects()"></app-section-editor>
          }
          @case ('skills') {
            <app-section-editor title="Skills" subtitle="Grouped by category on the public page."
              singular="Skill" testKey="skill" titleField="name" subtitleField="category"
              [items]="skills()" [fields]="skillFields"
              [onCreate]="createSkill" [onUpdate]="updateSkill" [onDelete]="deleteSkill"
              (changed)="reloadSkills()"></app-section-editor>
          }
          @case ('achievements') {
            <app-section-editor title="Achievements" subtitle="Certifications, awards, contests."
              singular="Achievement" testKey="ach" titleField="title" subtitleField="achievedOn"
              [items]="achievements()" [fields]="achievementFields"
              [onCreate]="createAchievement" [onUpdate]="updateAchievement" [onDelete]="deleteAchievement"
              (changed)="reloadAchievements()"></app-section-editor>
          }
          @case ('education') {
            <app-section-editor title="Education" subtitle="Timeline of degrees and schools."
              singular="Education" testKey="edu" titleField="degree" subtitleField="institution"
              [items]="education()" [fields]="educationFields"
              [onCreate]="createEducation" [onUpdate]="updateEducation" [onDelete]="deleteEducation"
              (changed)="reloadEducation()"></app-section-editor>
          }
          @case ('experience') {
            <app-section-editor title="Experience" subtitle="Roles, training, internships."
              singular="Experience" testKey="exp" titleField="role" subtitleField="organization"
              [items]="experience()" [fields]="experienceFields"
              [onCreate]="createExperience" [onUpdate]="updateExperience" [onDelete]="deleteExperience"
              (changed)="reloadExperience()"></app-section-editor>
          }
          @case ('activities') {
            <app-section-editor title="Extracurricular Activities" subtitle="Beyond code — clubs, hackathons, events."
              singular="Activity" testKey="act" titleField="title" subtitleField="activityDate"
              [items]="activities()" [fields]="activityFields"
              [onCreate]="createActivity" [onUpdate]="updateActivity" [onDelete]="deleteActivity"
              (changed)="reloadActivities()"></app-section-editor>
          }
          @case ('services') {
            <app-section-editor title="Other Services" subtitle="Things you can help with beyond software."
              singular="Service" testKey="svc" titleField="name" subtitleField="startingPrice"
              [items]="services()" [fields]="serviceFields"
              [onCreate]="createService" [onUpdate]="updateService" [onDelete]="deleteService"
              (changed)="reloadServices()"></app-section-editor>
          }
          @case ('social') {
            <app-section-editor title="Social Links" subtitle="Public profile URLs."
              singular="Link" testKey="soc" titleField="platform" subtitleField="url"
              [items]="social()" [fields]="socialFields"
              [onCreate]="createSocial" [onUpdate]="updateSocial" [onDelete]="deleteSocial"
              (changed)="reloadSocial()"></app-section-editor>
          }
          @case ('blog') {
            <app-section-editor title="Blog Posts" subtitle="Write in markdown. Toggle Published (true/false) to publish or unpublish."
              singular="Post" testKey="blog" titleField="title" subtitleField="slug"
              [items]="blogPosts()" [fields]="blogFields"
              [onCreate]="createBlog" [onUpdate]="updateBlog" [onDelete]="deleteBlog"
              (changed)="reloadBlog()"></app-section-editor>
          }
          @case ('settings') { <ng-container *ngTemplateOutlet="settingsTpl"></ng-container> }
        }
      </main>
    </div>

    <!-- Overview template -->
    <ng-template #overviewTpl>
      <h1>Overview</h1>
      <p class="muted">Lightweight analytics — no third-party tracking.</p>
      @if (summary()) {
        <div class="stats">
          <div class="stat card"><div class="k">Page views</div><div class="v">{{ summary()!.pageViews }}</div></div>
          <div class="stat card"><div class="k">Resume downloads</div><div class="v">{{ summary()!.resumeDownloads }}</div></div>
          <div class="stat card"><div class="k">Project views</div><div class="v">{{ summary()!.projectViews }}</div></div>
        </div>
        <h2 class="sub">Top projects</h2>
        <div class="card list">
          @if (summary()!.perProject.length === 0) { <p class="muted">No project views yet.</p> }
          @for (p of summary()!.perProject; track p.projectId) {
            <div class="stat-row"><span>{{ projectName(p.projectId) }}</span><span class="badge">{{ p.views }} views</span></div>
          }
        </div>
      } @else if (loadingSummary()) { <div class="skeleton" style="height:160px;"></div> }
    </ng-template>

    <!-- Messages template -->
    <ng-template #messagesTpl>
      <h1>Contact messages</h1>
      @if (loadingMsg()) { <div class="skeleton" style="height:200px;"></div> }
      @else if (messages().length === 0) { <p class="muted">No messages yet.</p> }
      @else {
        <div class="msgs">
          @for (m of messages(); track m.id) {
            <article class="card msg" [class.unread]="!m.isRead" [attr.data-testid]="'msg-' + m.id">
              <header>
                <div>
                  <strong>{{ m.name }}</strong> <span class="muted">&lt;{{ m.email }}&gt;</span>
                  @if (m.phone) { <span class="muted"> · {{ m.phone }}</span> }
                </div>
                <small class="muted">{{ m.createdAt | date:'medium' }}</small>
              </header>
              <h3>{{ m.subject }}</h3>
              <p class="body">{{ m.message }}</p>
              <div class="actions">
                @if (!m.isRead) {
                  <button class="btn ghost" (click)="markRead(m)" [attr.data-testid]="'read-' + m.id">
                    <i class="fa-solid fa-check"></i> Mark as read
                  </button>
                } @else { <span class="badge">Read</span> }
                <button class="btn" (click)="del(m)" [attr.data-testid]="'del-' + m.id">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </article>
          }
        </div>
      }
    </ng-template>

    <!-- Settings template -->
    <ng-template #settingsTpl>
      <h1>Settings</h1>
      <p class="muted">Change your admin password or send a test digest.</p>

      <div class="card settings">
        <h3 class="sub-h">Change password</h3>
        <label>
          <span>Current password</span>
          <input [(ngModel)]="pwdCurrent" type="password" autocomplete="current-password" data-testid="pwd-current">
        </label>
        <label>
          <span>New password</span>
          <input [(ngModel)]="pwdNew" type="password" autocomplete="new-password" data-testid="pwd-new">
          <em class="hint">Minimum 8 characters. Mix letters, numbers and symbols.</em>
        </label>
        <label>
          <span>Confirm new password</span>
          <input [(ngModel)]="pwdConfirm" type="password" autocomplete="new-password" data-testid="pwd-confirm">
        </label>
        @if (pwdError()) { <div class="err" data-testid="pwd-error">{{ pwdError() }}</div> }
        <button class="btn primary" (click)="changePassword()" [disabled]="pwdSaving()" data-testid="pwd-save">
          @if (pwdSaving()) { <i class="fa-solid fa-spinner fa-spin"></i> Updating... }
          @else { <i class="fa-solid fa-key"></i> Update password }
        </button>
      </div>

      <div class="card settings">
        <h3 class="sub-h">Weekly digest</h3>
        <p class="muted small">
          Sends a summary of the last 7 days of messages + top project views to <strong>{{ auth.username() }}</strong>'s
          registered email. Use this to preview the template.
        </p>
        <button class="btn" (click)="sendTestDigest()" [disabled]="digestSending()" data-testid="digest-send">
          @if (digestSending()) { <i class="fa-solid fa-spinner fa-spin"></i> Sending... }
          @else { <i class="fa-solid fa-paper-plane"></i> Send test digest now }
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .wrap { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
    .side {
      background: var(--bg-1); border-right: 1px solid var(--card-border);
      padding: 24px; display: flex; flex-direction: column; gap: 20px;
      overflow-y: auto;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand .dot { width: 12px; height: 12px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
    .name { font-family: var(--font-mono); font-weight: 700; }
    .who { color: var(--text-dim); font-size: .8rem; }
    nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .group-label { font-family: var(--font-mono); font-size: .7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: .12em; margin: 12px 0 4px 8px; }
    nav button {
      display: flex; align-items: center; gap: 10px; padding: 9px 12px;
      background: transparent; color: var(--text-dim); border: none;
      border-radius: var(--radius-sm); text-align: left; font-size: .92rem;
      cursor: pointer; transition: background .18s, color .18s;
    }
    nav button:hover { background: rgba(255,255,255,0.04); color: var(--text); }
    nav button.active { background: rgba(125,211,252,0.15); color: var(--accent); }
    .pill { margin-left: auto; background: var(--accent); color: var(--bg-0); font-size: .72rem; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
    .foot { display: flex; flex-direction: column; gap: 6px; padding-top: 12px; border-top: 1px solid var(--card-border); }
    .link { color: var(--text-dim); font-size: .9rem; background: none; border: none; text-align: left; cursor: pointer; padding: 6px 0; }
    .link:hover { color: var(--accent); }

    .main { padding: 32px 48px; overflow-y: auto; }
    h1 { margin-bottom: 4px; }
    .muted { color: var(--text-dim); }
    .sub { margin: 32px 0 12px; font-size: 1.1rem; }
    .err { color: var(--error); font-size: .88rem; }
    .hint { color: var(--text-dim); font-size: .74rem; font-style: normal; }

    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-top: 20px; }
    .stat { text-align: left; }
    .stat .k { color: var(--text-dim); font-family: var(--font-mono); font-size: .78rem; text-transform: uppercase; letter-spacing: .1em; }
    .stat .v { font-family: var(--font-display); font-size: 2.2rem; margin-top: 6px; }
    .list .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--card-border); }
    .list .stat-row:last-child { border-bottom: 0; }

    .msgs { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
    .msg header { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 6px; flex-wrap: wrap; }
    .msg h3 { margin: 6px 0; }
    .msg.unread { border-color: var(--accent); }
    .msg .body { white-space: pre-wrap; margin: 10px 0; }
    .msg .actions { display: flex; gap: 8px; flex-wrap: wrap; }

    .settings { max-width: 520px; margin-top: 20px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
    .settings .sub-h { margin: 0 0 4px; font-size: 1.05rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .08em; color: var(--accent); }
    .settings label { display: flex; flex-direction: column; gap: 6px; font-size: .88rem; color: var(--text-dim); }
    .settings input { padding: 10px 12px; border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.04); border: 1px solid var(--card-border);
      color: var(--text); font-family: inherit; }
    .settings input:focus { outline: none; border-color: var(--accent); }
    .settings .btn { align-self: flex-start; }
    .small { font-size: .88rem; }

    @media (max-width: 820px) {
      .wrap { grid-template-columns: 1fr; }
      .side { border-right: none; border-bottom: 1px solid var(--card-border); position: sticky; top: 0; z-index: 5; }
      .main { padding: 24px; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private admin = inject(AdminService);
  private portfolio = inject(PortfolioService);
  private router = inject(Router);
  private toast = inject(ToastService);

  tab = signal<Tab>('overview');

  summary = signal<AnalyticsSummary | null>(null);
  loadingSummary = signal(true);

  messages = signal<AdminMessage[]>([]);
  loadingMsg = signal(true);
  unreadCount = signal(0);

  projects = signal<Project[]>([]);
  skills = signal<Skill[]>([]);
  achievements = signal<Achievement[]>([]);
  education = signal<Education[]>([]);
  experience = signal<Experience[]>([]);
  activities = signal<Activity[]>([]);
  services = signal<ServiceOffering[]>([]);
  social = signal<SocialLink[]>([]);
  blogPosts = signal<BlogPost[]>([]);

  // Password change state
  pwdCurrent = '';
  pwdNew = '';
  pwdConfirm = '';
  pwdError = signal<string | null>(null);
  pwdSaving = signal(false);

  digestSending = signal(false);

  /* Field specs for each section */
  projectFields: FieldSpec[] = [
    { name: 'title', label: 'Title', placeholder: 'Employee Management System' },
    { name: 'category', label: 'Category', placeholder: 'Full Stack | Backend | Frontend' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'problemSolved', label: 'Problem solved', type: 'textarea' },
    { name: 'technologies', label: 'Technologies', placeholder: 'Java, Spring Boot, Angular', hint: 'Comma-separated' },
    { name: 'keyFeatures', label: 'Key features', type: 'textarea' },
    { name: 'role', label: 'Your role' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
    { name: 'demoUrl', label: 'Demo URL', type: 'url' },
    { name: 'imageUrl', label: 'Image URL', type: 'url', hint: '/assets/projects/... or full URL' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  skillFields: FieldSpec[] = [
    { name: 'name', label: 'Name', placeholder: 'Spring Boot' },
    { name: 'category', label: 'Category', placeholder: 'Backend | Frontend | Databases | ...' },
    { name: 'level', label: 'Level', placeholder: 'Beginner | Intermediate | Proficient | Familiar | Practicing' },
    { name: 'icon', label: 'Icon (optional)' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  achievementFields: FieldSpec[] = [
    { name: 'title', label: 'Title' },
    { name: 'achievedOn', label: 'Year / Date' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'proofUrl', label: 'Proof URL', type: 'url' },
    { name: 'icon', label: 'Icon' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  educationFields: FieldSpec[] = [
    { name: 'degree', label: 'Degree' },
    { name: 'institution', label: 'Institution' },
    { name: 'location', label: 'Location' },
    { name: 'startYear', label: 'Start year' },
    { name: 'endYear', label: 'End year' },
    { name: 'grade', label: 'Grade / CGPA / %' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  experienceFields: FieldSpec[] = [
    { name: 'role', label: 'Role' },
    { name: 'organization', label: 'Organization' },
    { name: 'duration', label: 'Duration', placeholder: 'Jan 2025 — Present' },
    { name: 'location', label: 'Location' },
    { name: 'responsibilities', label: 'Responsibilities', type: 'textarea' },
    { name: 'technologies', label: 'Technologies' },
    { name: 'achievements', label: 'Achievements', type: 'textarea' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  activityFields: FieldSpec[] = [
    { name: 'title', label: 'Title' },
    { name: 'activityDate', label: 'Date / Duration' },
    { name: 'organization', label: 'Organization' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'proofUrl', label: 'Proof URL', type: 'url' },
    { name: 'icon', label: 'Icon' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  serviceFields: FieldSpec[] = [
    { name: 'name', label: 'Service name' },
    { name: 'startingPrice', label: 'Starting price', placeholder: 'Contact for details' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'tools', label: 'Tools' },
    { name: 'icon', label: 'Icon' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  socialFields: FieldSpec[] = [
    { name: 'platform', label: 'Platform', placeholder: 'LinkedIn / GitHub / ...' },
    { name: 'url', label: 'URL', type: 'url' },
    { name: 'icon', label: 'Icon' },
    { name: 'displayOrder', label: 'Display order', type: 'number' }
  ];
  blogFields: FieldSpec[] = [
    { name: 'title', label: 'Title', placeholder: 'Post title' },
    { name: 'slug', label: 'Slug (optional)', hint: 'Auto-generated from title if left blank' },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', hint: 'Short summary shown in listings' },
    { name: 'content', label: 'Content (markdown)', type: 'textarea', hint: 'Supports # ## ### headings, **bold**, *italic*, `code`, ``` fenced blocks, - lists, [links](https://...)' },
    { name: 'tags', label: 'Tags', placeholder: 'Java, Spring Boot, Angular', hint: 'Comma-separated' },
    { name: 'coverImage', label: 'Cover image URL', type: 'url' },
    { name: 'readMinutes', label: 'Read minutes', type: 'number' },
    { name: 'published', label: 'Published (true / false)', hint: 'Type "true" to publish, "false" to keep as draft' }
  ];

  /* CRUD callables (arrow to preserve `this` in child component) */
  createProject   = (b: any)                => this.admin.createProject(b);
  updateProject   = (id: number, b: any)    => this.admin.updateProject(id, b);
  deleteProject   = (id: number)            => this.admin.deleteProject(id);
  createSkill     = (b: any)                => this.admin.createSkill(b);
  updateSkill     = (id: number, b: any)    => this.admin.updateSkill(id, b);
  deleteSkill     = (id: number)            => this.admin.deleteSkill(id);
  createAchievement = (b: any)              => this.admin.createAchievement(b);
  updateAchievement = (id: number, b: any)  => this.admin.updateAchievement(id, b);
  deleteAchievement = (id: number)          => this.admin.deleteAchievement(id);
  createEducation = (b: any)                => this.admin.createEducation(b);
  updateEducation = (id: number, b: any)    => this.admin.updateEducation(id, b);
  deleteEducation = (id: number)            => this.admin.deleteEducation(id);
  createExperience = (b: any)               => this.admin.createExperience(b);
  updateExperience = (id: number, b: any)   => this.admin.updateExperience(id, b);
  deleteExperience = (id: number)           => this.admin.deleteExperience(id);
  createActivity  = (b: any)                => this.admin.createActivity(b);
  updateActivity  = (id: number, b: any)    => this.admin.updateActivity(id, b);
  deleteActivity  = (id: number)            => this.admin.deleteActivity(id);
  createService   = (b: any)                => this.admin.createService(b);
  updateService   = (id: number, b: any)    => this.admin.updateService(id, b);
  deleteService   = (id: number)            => this.admin.deleteService(id);
  createSocial    = (b: any)                => this.admin.createSocial(b);
  updateSocial    = (id: number, b: any)    => this.admin.updateSocial(id, b);
  deleteSocial    = (id: number)            => this.admin.deleteSocial(id);
  createBlog      = (b: any)                => this.admin.createBlog(this.coercePublished(b));
  updateBlog      = (id: number, b: any)    => this.admin.updateBlog(id, this.coercePublished(b));
  deleteBlog      = (id: number)            => this.admin.deleteBlog(id);

  private coercePublished(b: any): any {
    if (typeof b?.published === 'string') {
      const v = b.published.toLowerCase().trim();
      b.published = v === 'true' || v === '1' || v === 'yes';
    }
    return b;
  }

  ngOnInit() {
    this.admin.analytics().subscribe({
      next: s => { this.summary.set(s); this.loadingSummary.set(false); },
      error: () => this.loadingSummary.set(false)
    });
    this.reloadMessages();
    this.reloadProjects();
    this.reloadSkills();
    this.reloadAchievements();
    this.reloadEducation();
    this.reloadExperience();
    this.reloadActivities();
    this.reloadServices();
    this.reloadSocial();
    this.reloadBlog();
  }

  reloadMessages() {
    this.loadingMsg.set(true);
    this.admin.messages().subscribe({
      next: r => {
        this.messages.set(r.content);
        this.unreadCount.set(r.content.filter(m => !m.isRead).length);
        this.loadingMsg.set(false);
      },
      error: () => this.loadingMsg.set(false)
    });
  }
  reloadProjects()     { this.portfolio.getProjects().subscribe(x => this.projects.set(x)); }
  reloadSkills()       { this.portfolio.getSkills().subscribe(x => this.skills.set(x)); }
  reloadAchievements() { this.portfolio.getAchievements().subscribe(x => this.achievements.set(x)); }
  reloadEducation()    { this.portfolio.getEducation().subscribe(x => this.education.set(x)); }
  reloadExperience()   { this.portfolio.getExperience().subscribe(x => this.experience.set(x)); }
  reloadActivities()   { this.portfolio.getActivities().subscribe(x => this.activities.set(x)); }
  reloadServices()     { this.portfolio.getServices().subscribe(x => this.services.set(x)); }
  reloadSocial()       { this.portfolio.getSocialLinks().subscribe(x => this.social.set(x)); }
  reloadBlog()         { this.admin.listBlog().subscribe(x => this.blogPosts.set(x)); }

  markRead(m: AdminMessage) {
    this.admin.markRead(m.id).subscribe(() => { m.isRead = true; this.unreadCount.set(this.messages().filter(x => !x.isRead).length); });
  }
  del(m: AdminMessage) {
    if (!confirm('Delete this message?')) return;
    this.admin.deleteMessage(m.id).subscribe(() => this.messages.set(this.messages().filter(x => x.id !== m.id)));
  }

  projectName(id: number): string { return this.projects().find(p => p.id === id)?.title || `Project #${id}`; }
  signOut() { this.auth.logout(); this.router.navigateByUrl('/admin/login'); }

  changePassword() {
    this.pwdError.set(null);
    if (!this.pwdCurrent || !this.pwdNew) { this.pwdError.set('All fields are required.'); return; }
    if (this.pwdNew.length < 8) { this.pwdError.set('New password must be at least 8 characters.'); return; }
    if (this.pwdNew !== this.pwdConfirm) { this.pwdError.set('Passwords do not match.'); return; }
    if (this.pwdNew === this.pwdCurrent) { this.pwdError.set('New password must differ from current.'); return; }
    this.pwdSaving.set(true);
    this.admin.changePassword(this.pwdCurrent, this.pwdNew).subscribe({
      next: () => {
        this.pwdSaving.set(false);
        this.pwdCurrent = this.pwdNew = this.pwdConfirm = '';
        this.toast.show('Password updated. Please sign in again.', 'success');
        setTimeout(() => this.signOut(), 1200);
      },
      error: err => {
        this.pwdSaving.set(false);
        this.pwdError.set(err?.error?.message || 'Failed to update password.');
      }
    });
  }

  sendTestDigest() {
    this.digestSending.set(true);
    this.admin.sendDigestNow().subscribe({
      next: () => {
        this.digestSending.set(false);
        this.toast.show('Digest sent — check your inbox.', 'success');
      },
      error: err => {
        this.digestSending.set(false);
        this.toast.show(err?.error?.message || 'Digest failed. Check MAIL_ENABLED and server logs.', 'error');
      }
    });
  }
}
