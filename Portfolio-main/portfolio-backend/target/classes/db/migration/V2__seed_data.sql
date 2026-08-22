-- V2__seed_data.sql
-- Seeded content for Bhuvnesh Singh Bhadauriya's portfolio.

INSERT INTO skill (name, category, level, icon, display_order) VALUES
('Java', 'Programming Languages', 'Intermediate', 'java', 1),
('TypeScript', 'Programming Languages', 'Intermediate', 'typescript', 2),
('JavaScript', 'Programming Languages', 'Intermediate', 'javascript', 3),
('SQL', 'Programming Languages', 'Intermediate', 'sql', 4),
('Spring Boot', 'Backend', 'Intermediate', 'spring', 1),
('Spring MVC', 'Backend', 'Intermediate', 'spring', 2),
('Spring Data JPA', 'Backend', 'Intermediate', 'spring', 3),
('REST APIs', 'Backend', 'Proficient', 'api', 4),
('Hibernate', 'Backend', 'Intermediate', 'hibernate', 5),
('Angular', 'Frontend', 'Intermediate', 'angular', 1),
('HTML', 'Frontend', 'Proficient', 'html', 2),
('CSS', 'Frontend', 'Intermediate', 'css', 3),
('PostgreSQL', 'Databases', 'Intermediate', 'postgres', 1),
('MySQL', 'Databases', 'Intermediate', 'mysql', 2),
('Git', 'Tools & Platforms', 'Proficient', 'git', 1),
('GitHub', 'Tools & Platforms', 'Proficient', 'github', 2),
('Maven', 'Tools & Platforms', 'Intermediate', 'maven', 3),
('Postman', 'Tools & Platforms', 'Intermediate', 'postman', 4),
('Docker', 'Tools & Platforms', 'Familiar', 'docker', 5),
('Data Structures', 'Core CS', 'Practicing', 'ds', 1),
('Algorithms', 'Core CS', 'Practicing', 'algo', 2),
('OOP', 'Core CS', 'Proficient', 'oop', 3),
('Communication', 'Soft Skills', 'Proficient', 'comm', 1),
('Teamwork', 'Soft Skills', 'Proficient', 'team', 2),
('Problem-solving', 'Soft Skills', 'Proficient', 'problem', 3);

INSERT INTO education (degree, institution, location, start_year, end_year, grade, description, display_order) VALUES
('B.Tech in Computer Science and Engineering', 'GLA University, Mathura', 'Mathura, Uttar Pradesh', '2022', '2026', 'CGPA: 7.96', 'Core CS coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering.', 1),
('Higher Secondary (12th)', 'Bal Vidyapeeth Public School', 'Bareilly, Uttar Pradesh', '2020', '2021', '85.6%', 'Science stream with Mathematics & Computer Science with Biology', 2),
('Secondary (10th)', 'Bal Vidyapeeth Public School', 'Bareilly, Uttar Pradesh', '2018', '2019', '91%', 'Consistent top-decile performance across mathematics and science.', 3);

INSERT INTO experience (organization, role, duration, location, responsibilities, technologies, achievements, display_order) VALUES
('BridgeLabz', 'Java Full Stack Trainee', 'Ongoing', 'Remote', 'Building full-stack applications using Java, Spring Boot, and Angular under structured training. Practicing DSA, OOP, and database design.', 'Java, Spring Boot, Angular, PostgreSQL, MySQL, REST APIs, Git', 'Completed hands-on modules on Spring Boot REST development and Angular UI building.', 1),
('Capgemini (Associated via BridgeLabz)', 'A4 Analyst (In Training)', 'Upcoming', 'India', 'Currently undergoing training for the A4 Analyst role associated with Capgemini. Focus on enterprise Java stack, code quality, and delivery practices.', 'Java, Spring Boot, SQL, Software Engineering Practices', 'Selected through BridgeLabz training program for the A4 Analyst role.', 2);

INSERT INTO project (title, description, problem_solved, technologies, key_features, role, github_url, demo_url, image_url, category, display_order) VALUES
('Employee Management System', 'Full-stack app to manage employees, departments, and payroll with role-based access.', 'Manual spreadsheet-based HR tracking was error-prone; this system centralizes CRUD and reporting.', 'Java, Spring Boot, Spring Data JPA, PostgreSQL, Angular, TypeScript', 'JWT auth, pagination, search, CSV export, department analytics.', 'Full Stack Developer', 'https://github.com/imbhuvi1/employee-management', NULL, '/assets/projects/employee-management.png', 'Full Stack', 1),
('Library Management Portal', 'Portal for anyone to access books & read', 'Users can comfortably read books online.', 'HTML, CSS, JS', 'Categorised books, Read-mode', 'Frontend Developer', 'https://github.com/imbhuvi1/e-library', NULL, '/assets/projects/student-portal.png', 'Frontend', 2),
('Task Management App', 'Kanban-style task tracker with drag-and-drop and deadline reminders.', 'Personal productivity tool to prioritize daily work.', 'Angular, TypeScript, Spring Boot, PostgreSQL', 'Drag-drop columns, priorities, reminders, filters.', 'Full Stack Developer', 'https://github.com/imbhuvi1/Zask/tree/dev', NULL, '/assets/projects/task-manager.png', 'Full Stack', 3),
('E-Commerce REST API', 'Backend service for a small e-commerce platform with product catalog, cart, and orders.', 'Provides a reusable, well-documented commerce backend.', 'Java, Spring Boot, Spring Security, JPA, PostgreSQL, Swagger', 'JWT auth, cart, orders, order status webhooks, OpenAPI docs.', 'Backend Developer', 'https://github.com/imbhuvi1/ecommerce-api', NULL, '/assets/projects/ecommerce-api.png', 'Backend', 4),
('Auth & Authorization Service', 'Reusable Spring Boot module for JWT-based auth with refresh tokens and roles.', 'Provides secure authentication boilerplate for future projects.', 'Java, Spring Boot, Spring Security, JWT, JPA, PostgreSQL', 'Access + refresh tokens, role-based access, password hashing with BCrypt.', 'Backend Developer', 'https://github.com/imbhuvi1/auth-service', NULL, '/assets/projects/auth-service.png', 'Backend', 5);

INSERT INTO achievement (title, description, achieved_on, proof_url, icon, display_order) VALUES
('Completed Java Full Stack Training Modules', 'Completed intensive Java + Spring Boot + Angular training modules via BridgeLabz.', '2026', NULL, 'award', 1),
('Built Multiple Spring Boot Projects', 'Delivered several REST API and full-stack projects with real-world features.', '2025', NULL, 'code', 2),
('Participated in Coding Contests', 'Actively participated in college-level and online coding contests at GLA University.', '2024', NULL, 'trophy', 3),
('Academic Projects in Java', 'Completed academic capstone projects using Java and databases.', '2024', NULL, 'book', 4);

INSERT INTO extracurricular_activity (title, description, activity_date, organization, proof_url, icon, display_order) VALUES
('College Coding Club Member', 'Active participant in college coding club sessions and peer-learning meetups.', '2022-2026', 'GLA University, Mathura', NULL, 'users', 1),
('Technical Seminar Attendee', 'Attended seminars on backend architecture and cloud computing.', '2024', 'GLA University', NULL, 'mic', 2),
('Hackathon Participant', 'Participated in a 24-hour college hackathon and built a working prototype.', '2024', 'GLA University', NULL, 'zap', 3);

INSERT INTO service_offering (name, description, tools, starting_price, icon, display_order) VALUES
('Video Editing', 'Basic to intermediate video editing for tutorials, reels, and short-form content.', 'DaVinci Resolve, CapCut', 'Contact for details', 'video', 1),
('Fitness Coaching', 'Personalized fitness guidance for beginners focused on form and consistency.', 'General fitness knowledge', 'Contact for details', 'activity', 2),
('Presentation Design', 'Clean, professional slide decks for academic and business use.', 'Google Slides, PowerPoint', 'Contact for details', 'presentation', 3),
('Technical Mentoring', 'Peer mentoring for Java, Spring Boot, and Angular fundamentals.', 'Java, Spring Boot, Angular', 'Contact for details', 'graduation-cap', 4);

INSERT INTO social_link (platform, url, icon, display_order) VALUES
('LinkedIn', 'https://www.linkedin.com/in/bhuvnesh1022', 'linkedin', 1),
('GitHub', 'https://github.com/imbhuvi1', 'github', 2),
('Instagram', 'https://www.instagram.com/thakurbhuvnesh_', 'instagram', 3),
('Email', 'mailto:bhuvneshsingh292@gmail.com', 'mail', 4),
('WhatsApp', 'https://wa.me/917451099215', 'whatsapp', 5);
