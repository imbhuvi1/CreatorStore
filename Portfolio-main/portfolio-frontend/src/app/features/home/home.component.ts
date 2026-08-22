import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSection } from './sections/hero.section';
import { AboutSection } from './sections/about.section';
import { AchievementsSection } from './sections/achievements.section';
import { EducationSection } from './sections/education.section';
import { ProjectsSection } from './sections/projects.section';
import { ExperienceSection } from './sections/experience.section';
import { SkillsSection } from './sections/skills.section';
import { ActivitiesSection } from './sections/activities.section';
import { ServicesSection } from './sections/services.section';
import { SocialSection } from './sections/social.section';
import { ContactSection } from './sections/contact.section';
import { BlogPreviewSection } from './sections/blog-preview.section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    HeroSection, AboutSection, AchievementsSection, EducationSection,
    ProjectsSection, ExperienceSection, SkillsSection, ActivitiesSection,
    ServicesSection, SocialSection, ContactSection, BlogPreviewSection],
  template: `
    <app-hero id="hero"></app-hero>
    <app-about id="about"></app-about>
    <app-projects id="projects"></app-projects>
    <app-skills id="skills"></app-skills>
    <app-experience id="experience"></app-experience>
    <app-education id="education"></app-education>
    <app-blog-preview id="blog"></app-blog-preview>
    <app-achievements id="achievements"></app-achievements>
    <app-activities id="activities"></app-activities>
    <app-services id="services"></app-services>
    <app-social id="social"></app-social>
    <app-contact id="contact"></app-contact>
  `
})
export class HomeComponent {}
