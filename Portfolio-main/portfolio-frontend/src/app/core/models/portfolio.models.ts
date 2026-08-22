export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  problemSolved?: string;
  technologies: string;
  keyFeatures?: string;
  role?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  category?: string;
  displayOrder?: number;
}

export interface Skill {
  id: number; name: string; category: string; level: string; icon?: string;
}
export interface Achievement {
  id: number; title: string; description: string; achievedOn?: string; proofUrl?: string; icon?: string;
}
export interface Education {
  id: number; degree: string; institution: string; location?: string;
  startYear?: string; endYear?: string; grade?: string; description?: string;
}
export interface Experience {
  id: number; organization: string; role: string; duration: string; location?: string;
  responsibilities?: string; technologies?: string; achievements?: string;
}
export interface Activity {
  id: number; title: string; description: string; activityDate?: string; organization?: string; proofUrl?: string; icon?: string;
}
export interface ServiceOffering {
  id: number; name: string; description: string; tools?: string; startingPrice?: string; icon?: string;
}
export interface SocialLink {
  id: number; platform: string; url: string; icon?: string;
}

export interface ContactRequest {
  name: string; email: string; phone?: string; subject: string; message: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string;
  readMinutes: number;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
