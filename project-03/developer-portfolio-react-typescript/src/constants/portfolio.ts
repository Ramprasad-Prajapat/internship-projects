export interface HeroData {
  title: string;
  subtitle: string;
  tagline: string;
  location: string;
  status: string;
}

export interface SocialLink {
  label: string;
  platform: 'github' | 'linkedin' | 'email';
  url: string;
}

export interface CTALink {
  id: string;
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  external?: boolean;
}

export interface EducationEntry {
  degree: string;
  branch: string;
  institution: string;
  location: string;
  duration: string;
  status: string;
  cgpa: string;
  relevantLearning: string[];
}

export interface ProjectChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  type: 'Internship' | 'Full-time' | 'Part-time' | 'Remote' | 'On-site';
  duration: string;
  location: string;
  technologies: string[];
  description: string;
  bullets?: string[];
  responsibilities?: string[];
}

export interface StrengthItem {
  name: string;
  category: 'Technical' | 'Soft Skill';
}

export interface PersonalPhilosophy {
  title: string;
  description: string;
  iconName: string;
}

export type SkillCategory =
  | 'Programming Languages'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Developer Tools'
  | 'Deployment / Platforms'
  | 'API Integration';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  summary: string;
  proficiencyBadge: 'Core Focus' | 'Proficient' | 'Hands-on' | 'Working Knowledge';
  iconName: string;
}

export type ProjectCategory = 'Full Stack' | 'Backend / API' | 'Web Application';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  problemStatement: string;
  solution: string;
  architectureOverview: string;
  techStack: string[];
  features: string[];
  challenges: string[];
  learnings: string[];
  futureImprovements: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  featured?: boolean;
  accuracyReported?: string;
}

export interface GitHubRepoItem {
  id: string;
  name: string;
  description: string;
  language: string;
  stars?: number;
  forks?: number;
  url: string;
  topics: string[];
  updatedAt: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialUrl?: string;
  skills: string[];
  previewImageUrl?: string;
}

export interface CodingProfile {
  id: string;
  platform: 'LeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'GitHub';
  username: string;
  profileUrl?: string;
  description: string;
  focusTopics: string[];
  statusLabel?: string;
  iconName: string;
}

export interface LearningTopic {
  id: string;
  topic: string;
  category: 'Backend Architecture' | 'System Design' | 'DevOps & Cloud' | 'Data Structures & Algorithms';
  status: 'Current Focus' | 'Exploring' | 'Practicing';
  description: string;
  keyConcepts: string[];
}

export interface EngineeringNote {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'Java & Spring' | 'React & Frontend' | 'Database Architecture' | 'Software Engineering';
  tags: string[];
  readTime: string;
  date: string;
  content: string;
}

export interface ArchitectureNode {
  id: string;
  layer: 'Frontend' | 'API Layer' | 'Backend Services' | 'Persistence' | 'Database';
  technology: string;
  description: string;
  whereUsed: string;
  relatedTech: string[];
}

export interface EngineeringProcessStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  keyDeliverable: string;
}

// Global Authoritative Portfolio Data

export const personalInfo = {
  name: "Ramprasad Prajapat",
  title: "Aspiring Software Engineer | Java Full Stack Developer",
  professionalTitle: "Aspiring Software Engineer | Java Full Stack Developer",
  academicStatus: "Final Year Student",
  degree: "B.Tech in Computer Science Engineering",
  branch: "Computer Science Engineering (CSE)",
  institution: "JIET Group of Institutions, Jodhpur",
  location: "Jodhpur, Rajasthan, India",
  availability: "Open to Software Engineering Opportunities",
  cgpa: "7.99",
  duration: "2023 – 2027",
  bio: "I am an aspiring Software Engineer and Java Full Stack Developer with hands-on experience building web applications using Java, Spring Boot, React.js, MySQL, and REST APIs. I enjoy developing backend services, responsive user interfaces, database-driven applications, and practical software solutions while focusing on clean, maintainable code.",
  engineeringValues: "Clean Code • SOLID Principles • Production Quality",
  primaryTechPill: "Java • Spring Boot • React.js • MySQL • REST APIs",
  contactEmail: "",
};

export const heroData: HeroData = {
  title: personalInfo.title,
  subtitle: personalInfo.bio,
  tagline: personalInfo.engineeringValues,
  location: personalInfo.location,
  status: `${personalInfo.academicStatus} • ${personalInfo.availability}`,
};

export const ctaLinks: CTALink[] = [
  {
    id: "resume",
    label: "View Resume",
    href: "/resume",
    variant: "primary",
  },
  {
    id: "projects",
    label: "View Projects",
    href: "/projects",
    variant: "secondary",
  },
  {
    id: "contact",
    label: "Contact Me",
    href: "/contact",
    variant: "outline",
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub Profile",
    platform: "github",
    url: "https://github.com/ramprasad-prajapat",
  },
  {
    label: "LinkedIn Profile",
    platform: "linkedin",
    url: "https://linkedin.com/in/ramprasad-prajapat",
  },
];

export const educationData: EducationEntry = {
  degree: "B.Tech in Computer Science Engineering",
  branch: "Computer Science Engineering (CSE)",
  institution: "JIET Group of Institutions, Jodhpur",
  location: "Jodhpur, Rajasthan, India",
  duration: "2023 – 2027",
  status: "Final Year Student",
  cgpa: "7.99",
  relevantLearning: [
    "Java Programming",
    "Data Structures & Algorithms",
    "Database Management Systems (DBMS)",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Web Development",
  ],
};

export const experienceData: ExperienceEntry[] = [
  {
    id: "digital-hammerr",
    role: "Web Development Intern",
    organization: "Digital Hammerr®",
    type: "On-site",
    duration: "May 2026 – Present",
    location: "Udaipur, Rajasthan, India",
    technologies: ["Java", "Spring Boot", "React.js", "MySQL", "HTML", "CSS", "JavaScript", "REST APIs", "Git", "GitHub", "Render", "Vercel", "Aiven"],
    description: "Working on full-stack web application development using Java, Spring Boot, React.js, MySQL, HTML, CSS, and JavaScript. Developing responsive user interfaces, REST APIs, and database-driven applications. Integrating third-party APIs and AI-powered features into web solutions while following clean coding practices. Collaborating with the team using Git & GitHub and deploying applications on Render, Vercel, and Aiven.",
  },
  {
    id: "shripriti",
    role: "Web Developer",
    organization: "Shripriti Educational & IT Hub",
    type: "Remote",
    duration: "May 2025 – June 2025",
    location: "Remote",
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL"],
    description: "Worked on responsive web application development using HTML, CSS, JavaScript, Bootstrap, and MySQL. Built dynamic web pages, implemented backend fundamentals, and developed database-driven projects while following clean coding practices and improving problem-solving skills.",
  },
];

export const coreStrengths: StrengthItem[] = [
  { name: "Java & Object-Oriented Programming", category: "Technical" },
  { name: "Spring Boot & REST API Engineering", category: "Technical" },
  { name: "React.js Frontend Integration", category: "Technical" },
  { name: "MySQL Database Design & Queries", category: "Technical" },
  { name: "Version Control (Git & GitHub)", category: "Technical" },
  { name: "Clean Architecture & Refactoring", category: "Technical" },
];

export const softSkills: StrengthItem[] = [
  { name: "Problem Solving", category: "Soft Skill" },
  { name: "Team Collaboration", category: "Soft Skill" },
  { name: "Continuous Learning", category: "Soft Skill" },
  { name: "Communication", category: "Soft Skill" },
];

export const engineeringPhilosophy: PersonalPhilosophy[] = [
  {
    title: "Clean & Maintainable Code",
    description: "Writing readable, well-structured code with separation of concerns and consistent standards.",
    iconName: "Code2",
  },
  {
    title: "Reliable REST APIs",
    description: "Designing RESTful endpoints and MySQL database schemas structured for performance and reliability.",
    iconName: "Server",
  },
  {
    title: "Responsive User Experience",
    description: "Building fast, dynamic, accessible web interfaces that work smoothly across all screen sizes.",
    iconName: "Layout",
  },
];

export const skillsData: SkillItem[] = [
  // Programming Languages
  {
    id: "java",
    name: "Java",
    category: "Programming Languages",
    summary: "Object-oriented programming, Collections Framework, multithreading, and backend application development.",
    proficiencyBadge: "Core Focus",
    iconName: "Coffee",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Programming Languages",
    summary: "Modern ES6+ syntax, async/await, DOM manipulation, and dynamic client-side logic.",
    proficiencyBadge: "Proficient",
    iconName: "Code",
  },
  {
    id: "html5",
    name: "HTML5",
    category: "Programming Languages",
    summary: "Semantic markup, accessible layout structures, and SEO best practices.",
    proficiencyBadge: "Proficient",
    iconName: "FileCode",
  },
  {
    id: "css3",
    name: "CSS3",
    category: "Programming Languages",
    summary: "Flexbox, CSS Grid, custom tokens, dark mode integration, and responsive design.",
    proficiencyBadge: "Proficient",
    iconName: "Palette",
  },

  // Frontend
  {
    id: "react",
    name: "React.js",
    category: "Frontend",
    summary: "Component-based UI development, React hooks, state management, and SPA routing.",
    proficiencyBadge: "Core Focus",
    iconName: "Atom",
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    category: "Frontend",
    summary: "Responsive grid layouts, UI components, and fast layout prototyping.",
    proficiencyBadge: "Proficient",
    iconName: "LayoutTemplate",
  },

  // Backend
  {
    id: "spring-boot",
    name: "Spring Boot",
    category: "Backend",
    summary: "REST API development, auto-configuration, dependency injection, and JPA data persistence.",
    proficiencyBadge: "Core Focus",
    iconName: "Server",
  },
  {
    id: "spring-framework",
    name: "Spring Framework",
    category: "Backend",
    summary: "Core Spring container, Inversion of Control (IoC), and bean management.",
    proficiencyBadge: "Proficient",
    iconName: "Layers",
  },
  {
    id: "spring-mvc",
    name: "Spring MVC",
    category: "Backend",
    summary: "Model-View-Controller pattern, HTTP request routing, and controller endpoints.",
    proficiencyBadge: "Proficient",
    iconName: "Layers",
  },
  {
    id: "spring-security",
    name: "Spring Security",
    category: "Backend",
    summary: "Basic authentication, security configurations, and request authorization filters.",
    proficiencyBadge: "Hands-on",
    iconName: "Shield",
  },
  {
    id: "servlets",
    name: "Servlets",
    category: "Backend",
    summary: "Java web request handling, HTTP session management, and servlet lifecycle.",
    proficiencyBadge: "Proficient",
    iconName: "Terminal",
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    category: "Backend",
    summary: "Designing RESTful endpoints, JSON payload contracts, and HTTP status handling.",
    proficiencyBadge: "Core Focus",
    iconName: "Send",
  },
  {
    id: "jdbc",
    name: "JDBC",
    category: "Backend",
    summary: "Database connection management, SQL statement execution, and result handling.",
    proficiencyBadge: "Proficient",
    iconName: "Database",
  },

  // Database
  {
    id: "mysql",
    name: "MySQL",
    category: "Database",
    summary: "Relational database schema design, normalized tables, joins, and SQL query writing.",
    proficiencyBadge: "Core Focus",
    iconName: "Database",
  },
  {
    id: "sql",
    name: "SQL",
    category: "Database",
    summary: "Data definition, manipulation, indexing fundamentals, and relational query structure.",
    proficiencyBadge: "Proficient",
    iconName: "Database",
  },

  // Developer Tools
  {
    id: "git",
    name: "Git",
    category: "Developer Tools",
    summary: "Version control, branching, committing, merging, and pull request workflows.",
    proficiencyBadge: "Proficient",
    iconName: "GitBranch",
  },
  {
    id: "github",
    name: "GitHub",
    category: "Developer Tools",
    summary: "Remote repository hosting, code collaboration, and team project management.",
    proficiencyBadge: "Proficient",
    iconName: "Github",
  },
  {
    id: "postman",
    name: "Postman",
    category: "Developer Tools",
    summary: "API testing, request collection creation, and endpoint payload verification.",
    proficiencyBadge: "Proficient",
    iconName: "Send",
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "Developer Tools",
    summary: "Frontend and full-stack web application development environment.",
    proficiencyBadge: "Proficient",
    iconName: "Monitor",
  },
  {
    id: "intellij",
    name: "IntelliJ IDEA",
    category: "Developer Tools",
    summary: "Java and Spring Boot application development, debugging, and code refactoring.",
    proficiencyBadge: "Core Focus",
    iconName: "Cpu",
  },

  // Deployment / Platforms
  {
    id: "render",
    name: "Render",
    category: "Deployment / Platforms",
    summary: "Deploying web applications and cloud service endpoints.",
    proficiencyBadge: "Hands-on",
    iconName: "Cloud",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Deployment / Platforms",
    summary: "Deploying frontend React web applications with automated GitHub builds.",
    proficiencyBadge: "Hands-on",
    iconName: "Globe",
  },
  {
    id: "aiven",
    name: "Aiven",
    category: "Deployment / Platforms",
    summary: "Managing cloud database instances for backend persistence.",
    proficiencyBadge: "Hands-on",
    iconName: "Database",
  },

  // API Integration
  {
    id: "rest-integration",
    name: "REST API Integration",
    category: "API Integration",
    summary: "Connecting React frontend applications to HTTP backend services.",
    proficiencyBadge: "Core Focus",
    iconName: "Send",
  },
  {
    id: "third-party-apis",
    name: "Third-party API Integration",
    category: "API Integration",
    summary: "Integrating external HTTP services and JSON data feeds into web apps.",
    proficiencyBadge: "Hands-on",
    iconName: "Layers",
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    category: "API Integration",
    summary: "Integrating AI text models into application features.",
    proficiencyBadge: "Hands-on",
    iconName: "Sparkles",
  },
  {
    id: "gemini-api",
    name: "Gemini API",
    category: "API Integration",
    summary: "Integrating AI capabilities into full-stack web solutions.",
    proficiencyBadge: "Hands-on",
    iconName: "Sparkles",
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: "emotion-detection",
    title: "Real-Time Emotion Detection System",
    category: "Web Application",
    shortDescription: "Computer vision system for detecting human facial expressions in real time with ~85% accuracy.",
    fullDescription: "A computer vision application that captures live camera feeds, detects facial expressions, and classifies emotional states (happy, sad, neutral, angry, surprised) with ~85% accuracy.",
    problemStatement: "Manual or delayed emotion assessment lacks immediate feedback for human-computer interaction and monitoring tools.",
    solution: "Developed a computer vision pipeline using OpenCV and machine learning to analyze face features and display real-time emotion classifications.",
    architectureOverview: "Webcam Video Stream -> OpenCV Face Detection -> Preprocessing -> Classification Model -> Visual Overlay.",
    techStack: ["Python", "OpenCV", "Machine Learning", "Deep Learning"],
    features: [
      "Real-time webcam video feed processing",
      "Facial bounding box and landmark detection",
      "Emotion classification with ~85% reported accuracy",
      "Visual emotion label overlay on stream",
    ],
    challenges: [
      "Optimizing frame processing speed to prevent video lag",
      "Handling variations in ambient lighting and camera positions",
    ],
    learnings: [
      "Computer vision image preprocessing and feature extraction",
      "Model evaluation metrics and accuracy testing",
    ],
    futureImprovements: [
      "Building a React frontend dashboard to graph historical emotion analytics",
    ],
    featured: true,
    accuracyReported: "~85%",
  },
  {
    id: "face-recognition-attendance",
    title: "Face Recognition Attendance System",
    category: "Web Application",
    shortDescription: "Automated attendance tracking system leveraging facial recognition algorithms.",
    fullDescription: "An attendance automation system that identifies registered individuals via live video feed and logs attendance records directly into a database.",
    problemStatement: "Manual attendance taking is slow, prone to proxy marking, and inefficient for groups.",
    solution: "Built a facial recognition script that extracts facial encodings, matches them against a stored database, and logs timestamps automatically.",
    architectureOverview: "Video Feed -> Face Detection & Encodings -> Profile Matcher -> Relational Database Log.",
    techStack: ["Python", "OpenCV", "Machine Learning", "MySQL"],
    features: [
      "Face encoding and profile registration",
      "Automated face matching via live video feed",
      "Timestamped attendance logging into MySQL database",
      "Date-wise attendance record summary",
    ],
    challenges: [
      "Determining appropriate face encoding distance thresholds to minimize false matches",
      "Managing database connection pooling during concurrent face hits",
    ],
    learnings: [
      "Facial encoding comparisons and computer vision workflows",
      "Integrating Python automation scripts with relational MySQL databases",
    ],
    futureImprovements: [
      "Adding liveness detection to prevent photo spoofing",
    ],
    featured: true,
  },
  {
    id: "fake-news-detection",
    title: "Fake News Detection System",
    category: "Web Application",
    shortDescription: "Machine learning NLP application for classifying news articles as authentic or misleading.",
    fullDescription: "A Natural Language Processing (NLP) text classification application that analyzes news headlines and body text to determine the probability of news authenticity.",
    problemStatement: "Online misinformation spreads rapidly, creating a need for automated text credibility analysis.",
    solution: "Trained TF-IDF vectorizers and classification models on news datasets to compute probability scores for input text.",
    architectureOverview: "Input Text -> Text Cleaning & Tokenization -> TF-IDF Vectorizer -> Machine Learning Classifier -> Credibility Score.",
    techStack: ["Python", "NLP", "Machine Learning", "Scikit-Learn"],
    features: [
      "Text preprocessing (lowercasing, stopword removal, stemming)",
      "TF-IDF feature extraction",
      "Confidence score output",
      "Interactive text evaluation interface",
    ],
    challenges: [
      "Handling ambiguous headlines and nuanced journalistic language",
      "Balancing precision and recall across balanced news datasets",
    ],
    learnings: [
      "Natural Language Processing vectorization techniques",
      "Machine learning classification model evaluation",
    ],
    futureImprovements: [
      "Integrating transformer-based models (BERT) for deeper contextual analysis",
    ],
    featured: true,
  },
  {
    id: "rajasthan-civic-connect",
    title: "Rajasthan Civic Connect",
    category: "Full Stack",
    shortDescription: "Web platform enabling citizens to report municipal infrastructure issues to local authorities.",
    fullDescription: "A full-stack web application designed for reporting local civic issues (such as road damage or water supply problems) and tracking administrative resolution status.",
    problemStatement: "Citizens lack a transparent, centralized system to report civic issues and monitor administrative progress.",
    solution: "Engineered a web application with Spring Boot REST services, React frontend components, and MySQL persistence.",
    architectureOverview: "React Client -> REST API Endpoints -> Spring Boot Controller/Service/JPA -> MySQL Relational DB.",
    techStack: ["Java", "Spring Boot", "React.js", "MySQL", "REST APIs", "Bootstrap"],
    features: [
      "Citizen complaint submission with category tagging",
      "Real-time status tracking timeline",
      "Admin dashboard for reviewing and updating complaint status",
      "Responsive layout for mobile and desktop",
    ],
    challenges: [
      "Designing clean relational database schemas for status state transitions",
      "Implementing server-side request validation for complaint payloads",
    ],
    learnings: [
      "Spring Data JPA entity mapping and RESTful endpoint design",
      "Managing status state transitions in React",
    ],
    futureImprovements: [
      "Integrating GIS geolocation mapping for auto-filling complaint locations",
    ],
    featured: true,
  },
  {
    id: "food-delivery-system",
    title: "Food Delivery System",
    category: "Full Stack",
    shortDescription: "Full-stack food ordering platform with menu management, dynamic shopping cart, and order checkout.",
    fullDescription: "A full-stack food ordering web application enabling users to browse restaurant menus, filter items, manage a dynamic shopping cart, and place orders.",
    problemStatement: "Online food ordering requires reliable shopping cart state management and structured order processing.",
    solution: "Built a web application featuring interactive menu filtering, client cart persistence, dynamic totals calculation, and database order storage.",
    architectureOverview: "React SPA UI -> Spring Boot REST Controllers -> Service Layer -> JPA Repository -> MySQL Database.",
    techStack: ["Java", "Spring Boot", "React.js", "REST APIs", "MySQL"],
    features: [
      "Categorized menu item display with search filtering",
      "Dynamic shopping cart with quantity modifications and price totals",
      "Order checkout processing",
      "Order history tracking",
    ],
    challenges: [
      "Keeping client-side cart state synchronized with item pricing",
      "Structuring relational database mappings between Orders and OrderItems",
    ],
    learnings: [
      "Spring Data JPA @OneToMany and @ManyToOne relationships",
      "React state management principles for shopping carts",
    ],
    futureImprovements: [
      "Adding sandbox payment gateway integration",
    ],
    featured: true,
  },
  {
    id: "smart-parking-system",
    title: "Smart Parking System",
    category: "Web Application",
    shortDescription: "Parking space availability tracking and slot reservation web application.",
    fullDescription: "A parking reservation web app that allows drivers to check live parking slot availability and pre-book slots to avoid urban traffic congestion.",
    problemStatement: "Drivers spend excessive time looking for open parking slots in busy urban areas.",
    solution: "Developed an interactive slot reservation system displaying real-time slot statuses and instant booking verification.",
    architectureOverview: "Client Web Interface -> Java Backend Service -> Slot Availability Engine -> MySQL DB.",
    techStack: ["Java", "Spring Boot", "JavaScript", "HTML5", "CSS3", "MySQL"],
    features: [
      "Visual grid of parking slot statuses (Available / Occupied / Reserved)",
      "Slot reservation form with entry time selection",
      "Booking confirmation summary",
      "Admin parking space management",
    ],
    challenges: [
      "Preventing duplicate slot bookings for overlapping time slots",
      "Optimizing query performance for availability checks",
    ],
    learnings: [
      "Database timestamp comparisons and query logic in SQL",
      "Designing responsive grid layouts for slot availability maps",
    ],
    futureImprovements: [
      "Adding QR code generation for entry gate verification",
    ],
    featured: false,
  },
  {
    id: "typing-runner",
    title: "Typing Runner",
    category: "Web Application",
    shortDescription: "Interactive gamified typing speed and accuracy testing web application.",
    fullDescription: "An interactive browser application that tests typing speed (WPM) and accuracy percentage with error highlighting and time choices.",
    problemStatement: "Standard typing tools lack immediate metric calculations and clean visual feedback.",
    solution: "Created a pure JavaScript web app featuring real-time WPM calculation, character color feedback, error tracking, and custom time limits.",
    architectureOverview: "Browser DOM Event Handling -> Real-time WPM Calculation Engine -> Dynamic UI Renderer.",
    techStack: ["JavaScript", "HTML5", "CSS3", "Git"],
    features: [
      "Real-time Words Per Minute (WPM) & Accuracy calculator",
      "Visual character color feedback (correct / error)",
      "Custom test duration options (30s, 60s, 120s)",
      "Final summary score breakdown modal",
    ],
    challenges: [
      "Calculating WPM accurately without double-counting backspaced characters",
      "Maintaining smooth 60fps timer performance without DOM stutter",
    ],
    learnings: [
      "Advanced JavaScript DOM keypress event listeners",
      "Formulating real-time performance tracking algorithms",
    ],
    futureImprovements: [
      "Connecting a Spring Boot backend API to store high score leaderboards",
    ],
    featured: false,
  },
  {
    id: "student-management-system",
    title: "Student Management System",
    category: "Backend / API",
    shortDescription: "Enterprise CRUD backend service for student records, course mappings, and academic grades.",
    fullDescription: "A structured Java Spring Boot REST API service built for managing student registrations, course enrollments, department mappings, and academic records.",
    problemStatement: "Educational institutions require organized database persistence to query and update student records reliably.",
    solution: "Developed a layered Spring Boot application exposing RESTful CRUD endpoints with request validation and MySQL persistence.",
    architectureOverview: "REST Controller -> Service Layer -> JPA Repository -> MySQL Relational Database.",
    techStack: ["Java", "Spring Boot", "MySQL", "REST APIs"],
    features: [
      "Student profile registration, search, update, and deletion",
      "Course enrollment mapping",
      "Pagination and sorting for student record lists",
      "Server-side request validation for roll numbers and emails",
    ],
    challenges: [
      "Implementing custom exception handling for duplicate email/roll number database constraints",
      "Writing clean Spring Data JPA custom repository queries",
    ],
    learnings: [
      "Adhering to Controller-Service-Repository separation of concerns",
      "RESTful API HTTP response code standards",
    ],
    futureImprovements: [
      "Adding Spring Security JWT authentication for admin roles",
    ],
    featured: false,
  },
];

export const githubReposData: GitHubRepoItem[] = [
  {
    id: "repo-1",
    name: "Rajasthan-Civic-Connect",
    description: "Citizen issue reporting and municipal complaint management system built with Java, Spring Boot, React, and MySQL.",
    language: "Java",
    url: "https://github.com/ramprasad-prajapat/Rajasthan-Civic-Connect",
    topics: ["java", "spring-boot", "react", "mysql", "rest-api"],
    updatedAt: "2026-07-28",
  },
  {
    id: "repo-2",
    name: "Food-Delivery-System",
    description: "Full-stack food ordering system with dynamic shopping cart, menu filtering, and order checkout.",
    language: "Java",
    url: "https://github.com/ramprasad-prajapat/Food-Delivery-System",
    topics: ["java", "spring-boot", "react", "bootstrap", "mysql"],
    updatedAt: "2026-07-15",
  },
  {
    id: "repo-3",
    name: "Emotion-Detection-System",
    description: "Real-time facial emotion detection application using computer vision and machine learning.",
    language: "Python",
    url: "https://github.com/ramprasad-prajapat/Emotion-Detection-System",
    topics: ["python", "opencv", "machine-learning", "deep-learning"],
    updatedAt: "2026-06-30",
  },
  {
    id: "repo-4",
    name: "Typing-Runner",
    description: "Interactive typing speed and accuracy testing web application featuring real-time WPM metrics.",
    language: "JavaScript",
    url: "https://github.com/ramprasad-prajapat/Typing-Runner",
    topics: ["javascript", "html5", "css3", "web-app"],
    updatedAt: "2026-05-20",
  },
];

export const certificationsData: CertificationItem[] = [
  {
    id: "cert-python-hackerrank",
    title: "Python (Basic) Certificate",
    organization: "HackerRank",
    issueDate: "September 2024",
    skills: ["Python", "Problem Solving"],
  },
];

export const codingProfilesData: CodingProfile[] = [
  {
    id: "leetcode",
    platform: "LeetCode",
    username: "ramprasad_dev",
    profileUrl: "https://leetcode.com",
    description: "Practicing Data Structures, Algorithms, Arrays, Hash Tables, Dynamic Programming, and Tree Traversals.",
    focusTopics: ["Arrays & Hashing", "Two Pointers", "Trees & Graphs", "Dynamic Programming"],
    statusLabel: "Active Practice",
    iconName: "Code2",
  },
  {
    id: "geeksforgeeks",
    platform: "GeeksforGeeks",
    username: "ramprasad_prajapat",
    profileUrl: "https://geeksforgeeks.org",
    description: "Practicing Java Collections Framework, Recursion, Sorting & Searching Algorithms, and Core Computer Science concepts.",
    focusTopics: ["Java Collections", "Recursion", "Sorting & Searching"],
    statusLabel: "Active Practice",
    iconName: "GraduationCap",
  },
  {
    id: "hackerrank",
    platform: "HackerRank",
    username: "ramprasad_prajapat",
    profileUrl: "https://hackerrank.com",
    description: "Practicing Object-Oriented Programming principles, Java Stream API, and SQL query writing.",
    focusTopics: ["Java OOP", "SQL Querying", "Problem Solving"],
    statusLabel: "Active Practice",
    iconName: "Award",
  },
  {
    id: "github-profile",
    platform: "GitHub",
    username: "ramprasad-prajapat",
    profileUrl: "https://github.com",
    description: "Source code repositories for Java Spring Boot backend services, REST APIs, and React web applications.",
    focusTopics: ["Spring Boot", "React.js", "MySQL Schemas", "REST APIs"],
    statusLabel: "Source Code Showcase",
    iconName: "Github",
  },
];

export const learningTopicsData: LearningTopic[] = [
  {
    id: "learn-spring-security",
    topic: "Spring Security 6 & JWT Auth",
    category: "Backend Architecture",
    status: "Current Focus",
    description: "Strengthening stateless authentication, role-based access control (RBAC), and JWT token management for Spring Boot APIs.",
    keyConcepts: ["SecurityFilterChain", "JWT Validation", "Password Encoding (BCrypt)", "CORS & CSRF"],
  },
  {
    id: "learn-system-design",
    topic: "System Design & High Availability Fundamentals",
    category: "System Design",
    status: "Exploring",
    description: "Studying scalable backend architectures, database indexing strategies, caching mechanisms, and load balancing concepts.",
    keyConcepts: ["Caching Strategies", "Database Indexing", "Load Balancing", "API Gateways"],
  },
  {
    id: "learn-dsa",
    topic: "Data Structures & Algorithms in Java",
    category: "Data Structures & Algorithms",
    status: "Current Focus",
    description: "Daily algorithmic problem solving using Java Collections, Graph algorithms (BFS/DFS), and time/space complexity analysis.",
    keyConcepts: ["Sliding Window", "Graph Traversals", "Binary Search", "Space Optimization"],
  },
  {
    id: "learn-docker",
    topic: "Docker & Containerization Fundamentals",
    category: "DevOps & Cloud",
    status: "Exploring",
    description: "Containerizing Spring Boot microservices and MySQL databases using Docker Compose for reproducible development environments.",
    keyConcepts: ["Dockerfile", "Docker Compose", "Multi-stage Builds", "Container Networks"],
  },
];

export const engineeringNotesData: EngineeringNote[] = [
  {
    id: "note-1",
    slug: "rest-api-design-spring-boot-clean-architecture",
    title: "Designing REST APIs in Spring Boot with Layered Architecture",
    summary: "A practical guide to structuring Spring Boot applications using Controller-Service-Repository separation, DTO mapping, and global exception handling.",
    category: "Java & Spring",
    tags: ["Java", "Spring Boot", "REST API", "Clean Code"],
    readTime: "5 min read",
    date: "2026-08-05",
    content: `
### Layered Architecture in Spring Boot Applications

When building Java backend services, maintaining a clear separation of concerns is essential for code readability, maintainability, and testability.

#### 1. Controller Layer
The REST Controller layer should handle incoming HTTP requests, validate incoming payloads (using \`@Valid\` annotations), delegate execution to the service layer, and return structured HTTP responses (\`ResponseEntity<T>\`).

#### 2. Service Layer
The Service layer contains all domain business logic and transaction boundaries (\`@Transactional\`). It transforms Data Transfer Objects (DTOs) and coordinates data persistence operations.

#### 3. Repository Layer
Spring Data JPA repositories manage database operations. Keeping SQL queries out of controllers ensures clear separation and easy mock testing.

#### 4. Global Exception Handling
Using \`@RestControllerAdvice\` and \`@ExceptionHandler\`, runtime exceptions are caught centrally and converted into standard JSON error responses.
    `.trim(),
  },
  {
    id: "note-2",
    slug: "react-state-management-performance-optimization",
    title: "React State Architecture & Component Optimization",
    summary: "Key strategies for managing application state with React hooks while avoiding unnecessary component re-renders.",
    category: "React & Frontend",
    tags: ["React", "TypeScript", "Performance", "State"],
    readTime: "4 min read",
    date: "2026-07-22",
    content: `
### Optimizing React Component Performance

Building fast web application interfaces requires careful management of state and component render cycles.

#### 1. Focused Context Providers
Splitting state into targeted contexts (e.g., ThemeContext, NotificationContext) prevents unrelated UI components from re-rendering during state updates.

#### 2. Utilizing React.memo & useCallback
Memoizing expensive child components with \`React.memo\` and wrapping callback functions with \`useCallback\` prevents unnecessary re-render loops.

#### 3. Code-Splitting with React.lazy
Lazy loading page routes with \`React.lazy()\` and \`Suspense\` reduces initial JavaScript bundle sizes and accelerates initial page load times.
    `.trim(),
  },
  {
    id: "note-3",
    slug: "mysql-relational-schema-indexing-best-practices",
    title: "Relational Database Schema Design & Indexing in MySQL",
    summary: "Best practices for designing normalized MySQL schemas, enforcing foreign key integrity, and leveraging indexes for fast query execution.",
    category: "Database Architecture",
    tags: ["MySQL", "SQL", "Database Design", "Performance"],
    readTime: "6 min read",
    date: "2026-06-18",
    content: `
### Relational Schema Optimization

Designing clean relational schemas provides a strong foundation for software applications.

#### 1. Normalization
Aim for Third Normal Form (3NF) to eliminate data redundancy and prevent update anomalies.

#### 2. Foreign Key Integrity
Define foreign key constraints explicitly to enforce referential integrity at the database engine level.

#### 3. Indexing Strategy
Create B-Tree indexes on frequently queried columns in \`WHERE\` clauses and join keys. Avoid redundant indexing on low-cardinality fields.
    `.trim(),
  },
];

export const architectureNodesData: ArchitectureNode[] = [
  {
    id: "node-frontend",
    layer: "Frontend",
    technology: "React.js + TypeScript",
    description: "Responsive Single Page Application client built with React, TypeScript, Tailwind CSS, and Framer Motion.",
    whereUsed: "Client UI, project showcases, skills inventory, and interactive filter controls.",
    relatedTech: ["TypeScript", "Tailwind CSS", "Axios", "React Router"],
  },
  {
    id: "node-api",
    layer: "API Layer",
    technology: "REST API Contracts",
    description: "Stateless JSON RESTful APIs specifying request payloads and HTTP status codes.",
    whereUsed: "Communication boundary between React SPA frontend and Spring Boot backend.",
    relatedTech: ["JSON Payload", "HTTP Status Codes", "Axios", "REST"],
  },
  {
    id: "node-backend",
    layer: "Backend Services",
    technology: "Java + Spring Boot",
    description: "Java backend services implementing Controller-Service-Repository layered architecture.",
    whereUsed: "Business logic processing, request validation, transaction management, and service routing.",
    relatedTech: ["Java", "Spring Boot", "Dependency Injection", "Spring MVC"],
  },
  {
    id: "node-persistence",
    layer: "Persistence",
    technology: "Spring Data JPA / Hibernate",
    description: "Object-Relational Mapping (ORM) layer managing database entity lifecycles.",
    whereUsed: "Mapping Java domain objects to MySQL relational tables with automated CRUD repository methods.",
    relatedTech: ["Hibernate ORM", "JPA Repositories", "@Transactional", "SQL Queries"],
  },
  {
    id: "node-database",
    layer: "Database",
    technology: "MySQL Relational DB",
    description: "ACID-compliant relational database storing structured entity records.",
    whereUsed: "Persistent storage for user profiles, complaints, menu items, orders, and attendance logs.",
    relatedTech: ["MySQL", "Indexes", "Foreign Keys", "ACID Compliance"],
  },
];

export const engineeringProcessSteps: EngineeringProcessStep[] = [
  {
    step: 1,
    title: "Requirements & Problem Analysis",
    subtitle: "Understanding Scope",
    description: "Analyze core objectives, define domain constraints, and detail technical requirements before writing code.",
    keyDeliverable: "Feature Spec & Scope Definition",
  },
  {
    step: 2,
    title: "Architecture & Data Modeling",
    subtitle: "Database & API Design",
    description: "Design normalized database tables, establish foreign key relationships, and specify REST API endpoint contracts.",
    keyDeliverable: "Schema Design & API Contracts",
  },
  {
    step: 3,
    title: "Backend API Development",
    subtitle: "Spring Boot Services",
    description: "Implement Java Spring Boot controllers, business logic services, JPA repositories, and exception handlers.",
    keyDeliverable: "RESTful Service Endpoints",
  },
  {
    step: 4,
    title: "Frontend UI & Component Design",
    subtitle: "Responsive UI",
    description: "Build clean React components with custom CSS tokens, responsive layouts, and proper state management hooks.",
    keyDeliverable: "Reusable UI Component System",
  },
  {
    step: 5,
    title: "API Integration & Testing",
    subtitle: "Connecting Client & Server",
    description: "Wire HTTP services, configure request/response handling, and implement graceful loading and error states.",
    keyDeliverable: "Integrated Data Flow",
  },
  {
    step: 6,
    title: "Optimization & Verification",
    subtitle: "Quality & Responsive QA",
    description: "Perform TypeScript checks, lint validation, responsive audits across screen sizes, and keyboard accessibility tests.",
    keyDeliverable: "Production-Ready Portfolio",
  },
];
