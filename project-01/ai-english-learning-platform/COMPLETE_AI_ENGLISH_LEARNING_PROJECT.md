# Complete Project Requirement & Technical Plan

# Free-First AI English Speaking Learning Website

**Project Type:** Full-stack web application  
**Frontend:** React + Vite + TypeScript + Tailwind CSS  
**Backend:** Java + Spring Boot REST API  
**Database:** MySQL  
**AI/Free Tools:** Browser SpeechRecognition, SpeechSynthesis, LanguageTool API, optional Gemini API free tier  
**Deployment Goal:** Easy deployment with low/free-cost services  
**Last Updated:** 24 June 2026

---

## 1. Project Vision

The main purpose of this project is to help a learner improve English speaking, writing, reading, grammar, vocabulary and daily practice consistency.

The website should solve these problems:

- User does not practice English every day.
- User does not know what to practice daily.
- User's mistakes are not saved anywhere.
- User does not get proper speaking/writing feedback.
- User cannot track improvement.
- User needs a complete management system for spoken English practice.

The website should work as a personal English learning manager.

Core loop:

```text
Daily Task
   ↓
Speak / Write / Read
   ↓
Get correction
   ↓
Save mistakes
   ↓
Repeat weak areas
   ↓
Track progress
   ↓
Next day personalized practice
```

---

## 2. Final Selected Technology Stack

## 2.1 Frontend

Use:

```text
React
Vite
TypeScript
Tailwind CSS
React Router DOM
Axios
React Hook Form
Zod
Lucide React / React Icons
```

Why:

- React is good for component-based UI.
- Vite is fast for development and production builds.
- TypeScript helps avoid bugs.
- Tailwind makes responsive UI easier.
- React Router handles multiple pages.
- Axios handles backend API calls.
- React Hook Form + Zod helps with forms and validation.

---

## 2.2 Backend

Use:

```text
Java 21
Spring Boot
Spring Web
Spring Data JPA
Spring Security
JWT Authentication
Spring Validation
MySQL Driver
Lombok
Maven
```

Why:

- Spring Boot is good for REST APIs.
- Spring Data JPA makes MySQL operations easier.
- Spring Security + JWT protects user data.
- Java backend is professional and scalable.
- Maven makes build/deploy simple.

---

## 2.3 Database

Use:

```text
MySQL
```

For development:

```text
Local MySQL / XAMPP MySQL / MySQL Workbench
```

For deployment:

```text
Aiven MySQL free tier / Railway MySQL / any managed MySQL provider
```

Recommended first choice:

```text
Aiven MySQL free tier
```

---

## 2.4 AI / Free APIs / Browser Tools

Use these free-first tools:

```text
Browser SpeechRecognition      → voice to text
Browser SpeechSynthesis        → text to voice
LanguageTool public API        → grammar/spelling/punctuation check
Gemini API free tier optional  → better AI correction/explanation
Rule-based local logic         → weak-area suggestions
```

Important:

- Do not depend fully on paid AI.
- Website should work even if Gemini API is not configured.
- Browser voice features should show fallback message if unsupported.
- LanguageTool should be used for short text to avoid free API limits.

---

# 3. High-Level Architecture

```text
User Browser
   ↓
React + Vite Frontend
   ↓ HTTP REST API
Java Spring Boot Backend
   ↓
MySQL Database
   ↓ Optional external APIs
LanguageTool API / Gemini API
```

---

## 3.1 Speaking Flow Architecture

```text
User speaks in browser
   ↓
Browser SpeechRecognition converts voice to text
   ↓
React sends transcript to Spring Boot backend
   ↓
Backend checks grammar using LanguageTool/Gemini/rules
   ↓
Backend stores speaking session and mistakes in MySQL
   ↓
Frontend shows correction and feedback
   ↓
Browser SpeechSynthesis reads correct answer aloud
```

---

## 3.2 Writing Flow Architecture

```text
User writes sentence/paragraph
   ↓
React sends text to backend
   ↓
Backend sends text to LanguageTool API
   ↓
Backend optionally sends text to Gemini API
   ↓
Backend prepares corrected text and mistake list
   ↓
Backend saves note, correction and mistakes in MySQL
   ↓
Frontend shows wrong text, correct text and explanation
```

---

## 3.3 Reading Flow Architecture

```text
Website shows paragraph
   ↓
User reads aloud
   ↓
Browser converts voice to text
   ↓
Frontend compares expected text vs spoken text
   ↓
Backend saves reading score and missed words
   ↓
Frontend shows reading accuracy
```

---

## 4. Main Features

## 4.1 Dashboard

Dashboard should show:

```text
Today Goal
Today Progress
Daily Streak
Speaking Status
Writing Status
Reading Status
Vocabulary Status
Homework Status
Repeated Mistakes
Weak Area Suggestion
Continue Previous Lesson
```

Example dashboard cards:

```text
Words learned today: 5 / 5
Sentences written: 3 / 5
Speaking answers: 2 / 3
Reading completed: 1 / 1
Homework: Pending
Streak: 4 days
Weak area: Present continuous tense
```

---

## 4.2 Today Progress

Track today's activities:

```text
Vocabulary words learned
Sentences written
Speaking attempts
Reading paragraphs completed
Grammar mistakes found
Mistakes corrected
Homework completed
Practice time
Daily score
Streak
```

Progress formula example:

```text
Daily Score =
Vocabulary completion 20%
Writing completion 20%
Speaking completion 25%
Reading completion 15%
Homework completion 20%
```

---

## 4.3 Daily Practice

Every day website should generate or show daily tasks.

Beginner example:

```text
1. Learn 5 words.
2. Write 5 sentences about your day.
3. Answer 3 speaking questions.
4. Read 1 short paragraph aloud.
5. Correct yesterday's mistakes.
```

Daily tasks can be generated using:

```text
Pre-made templates first
Rule-based logic based on weak area
Optional Gemini API if configured
```

---

## 4.4 Speaking Practice

Main purpose:

- Build confidence.
- Reduce hesitation.
- Save spoken answers.
- Correct grammar mistakes.
- Let user repeat correct answers.

Features:

```text
Speaking question bank
Start speaking button
Stop speaking button
Voice transcript
Correction
Better answer
Read correct answer aloud
Retry same answer
Save speaking history
Show fluency/confidence score
```

Question examples:

```text
Tell me about yourself.
What did you do today?
Describe your family.
What is your daily routine?
Why do you want to learn English?
What is your favorite food?
Tell me about your city.
What are your future goals?
```

Speaking feedback should show:

```text
Original answer
Corrected answer
Mistakes
Better words
Grammar explanation
Repeat practice button
```

---

## 4.5 Reading Practice

Features:

```text
Daily paragraph
Read aloud button
Speech-to-text transcript
Compare expected text with spoken text
Highlight missing words
Highlight wrong words
Reading accuracy score
Retry reading
Save reading history
```

Example:

```text
Expected:
I wake up early in the morning.

User said:
I wake early in morning.

Mistakes:
Missing: up, the
Accuracy: 75%
```

---

## 4.6 Writing Notebook

Features:

```text
Create note
Edit note
Delete note
Save note
Voice typing
Grammar check
Correction suggestion
Read corrected text aloud
Save mistakes
```

Writing tasks:

```text
Write about your day.
Write 5 sentences using today's vocabulary.
Write a short paragraph about your family.
Translate Hindi sentence to English.
Rewrite wrong sentence correctly.
```

---

## 4.7 Vocabulary

Features:

```text
Add new word
English meaning
Hindi meaning
Example sentence
My sentence
Pronunciation button
Mark as learned
Mark as weak
Daily revision
Search words
Filter learned/weak words
```

Vocabulary object example:

```json
{
  "id": 1,
  "word": "improve",
  "englishMeaning": "to make better",
  "hindiMeaning": "sudharna",
  "exampleSentence": "I want to improve my English.",
  "mySentence": "I improve my speaking every day.",
  "status": "LEARNING"
}
```

---

## 4.8 Grammar Practice

Beginner grammar topics:

```text
am / is / are
was / were
do / does / did
have / has / had
simple present tense
present continuous tense
simple past tense
future tense
articles: a / an / the
prepositions
common spoken English patterns
```

Practice types:

```text
Fill in the blanks
Correct the sentence
Make your own sentence
Speak the sentence
Hindi to English translation
Multiple choice grammar quiz
```

---

## 4.9 Homework

Daily homework should be shown.

Example:

```text
Today's Homework
1. Learn 5 vocabulary words.
2. Write 5 sentences about your day.
3. Speak for 1 minute about your routine.
4. Read one paragraph aloud.
5. Correct 3 old mistakes.
```

Homework status:

```text
PENDING
IN_PROGRESS
COMPLETED
```

---

## 4.10 Mistake History

Save every mistake from speaking, writing and reading.

Mistake types:

```text
Grammar
Spelling
Vocabulary
Pronunciation transcript mismatch
Missing word
Repeated mistake
Sentence structure
Tense mistake
Article mistake
Preposition mistake
```

Example:

```text
Wrong: I am go to market.
Correct: I am going to the market.
Rule: Use am/is/are + verb-ing for present continuous tense.
Source: Speaking
```

---

## 4.11 Weak Area Suggestion

Backend should analyze mistake history and suggest what to practice next.

Example:

```text
You made 8 mistakes in present continuous tense this week.
Tomorrow practice: am/is/are + verb-ing.
```

Rule examples:

```text
If user makes many article mistakes → suggest a/an/the practice.
If user misses small words in reading → suggest slow reading practice.
If user repeats tense mistakes → suggest tense drills.
If user writes very short answers → suggest paragraph writing.
If user does not speak daily → suggest 3 speaking questions.
```

---

## 4.12 Roadmap

Create beginner roadmap.

Example:

```text
Day 1: Self introduction + am/is/are + 5 words
Day 2: Daily routine + simple present + speaking questions
Day 3: Family topic + has/have + reading paragraph
Day 4: Past activities + simple past + writing task
Day 5: Future goals + will/going to + speaking task
```

Roadmap should adapt based on mistakes later.

---

## 5. Pages and Routes

Frontend routes:

```text
/                     Home / Landing
/login                Login
/register             Register
/dashboard            User dashboard
/today-progress       Today progress
/daily-practice       Daily practice
/speaking             Speaking practice
/reading              Reading practice
/writing              Writing notebook
/vocabulary           Vocabulary
/grammar              Grammar practice
/homework             Homework
/mistakes             Mistake history
/roadmap              Learning roadmap
/profile              User profile
/settings             Settings
```

Protected routes:

```text
/dashboard
/today-progress
/daily-practice
/speaking
/reading
/writing
/vocabulary
/grammar
/homework
/mistakes
/roadmap
/profile
/settings
```

Public routes:

```text
/
/login
/register
```

---

## 6. User Roles

Start with simple user system.

```text
USER
ADMIN optional later
```

MVP needs only USER.

Later ADMIN can manage:

```text
Question bank
Paragraph bank
Grammar lessons
Daily task templates
User management
```

---

## 7. Authentication

Use JWT authentication.

Flow:

```text
User registers
   ↓
Password hashed using BCrypt
   ↓
User logs in
   ↓
Backend returns JWT token
   ↓
Frontend stores token in localStorage
   ↓
Axios sends token in Authorization header
```

Header example:

```http
Authorization: Bearer <jwt_token>
```

Important security rule:

```text
Never store Gemini API key or secret keys in frontend.
Always call external AI APIs from backend.
```

---

## 8. Backend REST API Endpoints

## 8.1 Auth APIs

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Register request:

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "password123"
}
```

Login request:

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

Login response:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Rahul",
    "email": "rahul@example.com",
    "level": "BEGINNER"
  }
}
```

---

## 8.2 Dashboard APIs

```http
GET /api/dashboard/today
```

Response:

```json
{
  "todayGoal": {
    "wordsTarget": 5,
    "sentencesTarget": 5,
    "speakingTarget": 3,
    "readingTarget": 1,
    "homeworkTarget": 1
  },
  "todayProgress": {
    "wordsLearned": 3,
    "sentencesWritten": 2,
    "speakingAttempts": 1,
    "readingCompleted": 0,
    "homeworkCompleted": false,
    "dailyScore": 35
  },
  "weakArea": "Present continuous tense"
}
```

---

## 8.3 Vocabulary APIs

```http
GET    /api/vocabulary
POST   /api/vocabulary
PUT    /api/vocabulary/{id}
DELETE /api/vocabulary/{id}
POST   /api/vocabulary/{id}/mark-learned
POST   /api/vocabulary/{id}/mark-weak
```

Create request:

```json
{
  "word": "improve",
  "englishMeaning": "to make better",
  "hindiMeaning": "sudharna",
  "exampleSentence": "I want to improve my English.",
  "mySentence": "I improve my speaking every day."
}
```

---

## 8.4 Writing APIs

```http
POST /api/writing/check
POST /api/writing/notes
GET  /api/writing/notes
GET  /api/writing/notes/{id}
PUT  /api/writing/notes/{id}
DELETE /api/writing/notes/{id}
```

Writing check request:

```json
{
  "text": "I am go to market."
}
```

Writing check response:

```json
{
  "originalText": "I am go to market.",
  "correctedText": "I am going to the market.",
  "mistakes": [
    {
      "mistakeType": "GRAMMAR",
      "wrongText": "go",
      "suggestion": "going",
      "message": "Use verb-ing after am/is/are."
    }
  ]
}
```

---

## 8.5 Speaking APIs

```http
POST /api/speaking/analyze
GET  /api/speaking/history
GET  /api/speaking/history/{id}
```

Analyze request:

```json
{
  "question": "Tell me about your daily routine.",
  "transcript": "I wake up at 7 AM and I am go college."
}
```

Analyze response:

```json
{
  "question": "Tell me about your daily routine.",
  "originalAnswer": "I wake up at 7 AM and I am go college.",
  "correctedAnswer": "I wake up at 7 AM and go to college.",
  "feedback": "Good attempt. Remove unnecessary 'am' before go and use 'to college'.",
  "score": 72,
  "mistakes": [
    {
      "mistakeType": "GRAMMAR",
      "wrongText": "I am go college",
      "correctText": "I go to college"
    }
  ]
}
```

---

## 8.6 Reading APIs

```http
GET  /api/reading/today
POST /api/reading/check
GET  /api/reading/history
```

Check request:

```json
{
  "paragraphId": 1,
  "expectedText": "I wake up early in the morning.",
  "spokenText": "I wake early in morning."
}
```

Response:

```json
{
  "accuracy": 75,
  "missingWords": ["up", "the"],
  "wrongWords": [],
  "completed": true
}
```

---

## 8.7 Homework APIs

```http
GET  /api/homework/today
POST /api/homework/submit
GET  /api/homework/history
```

---

## 8.8 Mistake APIs

```http
GET  /api/mistakes
POST /api/mistakes
GET  /api/mistakes/repeated
GET  /api/mistakes/weak-area
POST /api/mistakes/{id}/mark-fixed
```

---

## 8.9 Progress APIs

```http
GET  /api/progress/today
POST /api/progress/update
GET  /api/progress/history
GET  /api/progress/weekly
GET  /api/progress/monthly
```

---

## 8.10 AI APIs

```http
POST /api/ai/grammar-check
POST /api/ai/improve-sentence
POST /api/ai/generate-daily-task
POST /api/ai/speaking-feedback
```

These backend APIs will internally call:

```text
LanguageTool API
Gemini API optional
Rule-based correction fallback
```

---

# 9. Database Design: MySQL Tables

## 9.1 users

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  level VARCHAR(50) DEFAULT 'BEGINNER',
  role VARCHAR(50) DEFAULT 'USER',
  daily_goal_minutes INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 9.2 vocabulary_words

```sql
CREATE TABLE vocabulary_words (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  word VARCHAR(100) NOT NULL,
  english_meaning TEXT,
  hindi_meaning TEXT,
  example_sentence TEXT,
  my_sentence TEXT,
  status VARCHAR(50) DEFAULT 'LEARNING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9.3 writing_notes

```sql
CREATE TABLE writing_notes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(200),
  original_text TEXT,
  corrected_text TEXT,
  ai_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9.4 speaking_sessions

```sql
CREATE TABLE speaking_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  question TEXT,
  transcript TEXT,
  corrected_answer TEXT,
  feedback TEXT,
  score INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9.5 reading_sessions

```sql
CREATE TABLE reading_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  paragraph_title VARCHAR(200),
  expected_text TEXT,
  spoken_text TEXT,
  accuracy INT DEFAULT 0,
  missing_words TEXT,
  wrong_words TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9.6 homework_tasks

```sql
CREATE TABLE homework_tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  task_date DATE NOT NULL,
  title VARCHAR(200),
  description TEXT,
  task_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'PENDING',
  user_answer TEXT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9.7 mistakes

```sql
CREATE TABLE mistakes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  source_type VARCHAR(50),
  mistake_type VARCHAR(100),
  wrong_text TEXT,
  correct_text TEXT,
  explanation TEXT,
  fixed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9.8 daily_progress

```sql
CREATE TABLE daily_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  progress_date DATE NOT NULL,
  words_learned INT DEFAULT 0,
  sentences_written INT DEFAULT 0,
  speaking_attempts INT DEFAULT 0,
  reading_completed INT DEFAULT 0,
  homework_completed BOOLEAN DEFAULT FALSE,
  mistakes_found INT DEFAULT 0,
  mistakes_fixed INT DEFAULT 0,
  practice_minutes INT DEFAULT 0,
  daily_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user_progress_date (user_id, progress_date)
);
```

---

## 9.9 ai_corrections

```sql
CREATE TABLE ai_corrections (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  source_type VARCHAR(50),
  original_text TEXT,
  corrected_text TEXT,
  provider VARCHAR(50),
  raw_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

# 10. Frontend Folder Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosClient.ts
│   │   ├── authApi.ts
│   │   ├── dashboardApi.ts
│   │   ├── vocabularyApi.ts
│   │   ├── writingApi.ts
│   │   ├── speakingApi.ts
│   │   ├── readingApi.ts
│   │   ├── homeworkApi.ts
│   │   ├── mistakeApi.ts
│   │   └── progressApi.ts
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── speaking/
│   │   ├── writing/
│   │   ├── reading/
│   │   └── vocabulary/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSpeechRecognition.ts
│   │   ├── useTextToSpeech.ts
│   │   └── useTodayProgress.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TodayProgress.tsx
│   │   ├── DailyPractice.tsx
│   │   ├── SpeakingPractice.tsx
│   │   ├── ReadingPractice.tsx
│   │   ├── WritingNotebook.tsx
│   │   ├── Vocabulary.tsx
│   │   ├── GrammarPractice.tsx
│   │   ├── Homework.tsx
│   │   ├── MistakeHistory.tsx
│   │   ├── Roadmap.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   │
│   ├── services/
│   │   ├── speechRecognitionService.ts
│   │   ├── textToSpeechService.ts
│   │   ├── tokenService.ts
│   │   └── localFallbackService.ts
│   │
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

# 11. Backend Folder Structure

```text
backend/
├── src/main/java/com/englishlearning/
│   ├── EnglishLearningApplication.java
│   │
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── DashboardController.java
│   │   ├── VocabularyController.java
│   │   ├── WritingController.java
│   │   ├── SpeakingController.java
│   │   ├── ReadingController.java
│   │   ├── HomeworkController.java
│   │   ├── MistakeController.java
│   │   ├── ProgressController.java
│   │   └── AiController.java
│   │
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── DashboardService.java
│   │   ├── VocabularyService.java
│   │   ├── WritingService.java
│   │   ├── SpeakingService.java
│   │   ├── ReadingService.java
│   │   ├── HomeworkService.java
│   │   ├── MistakeService.java
│   │   ├── ProgressService.java
│   │   ├── LanguageToolService.java
│   │   └── GeminiService.java
│   │
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── VocabularyRepository.java
│   │   ├── WritingNoteRepository.java
│   │   ├── SpeakingSessionRepository.java
│   │   ├── ReadingSessionRepository.java
│   │   ├── HomeworkRepository.java
│   │   ├── MistakeRepository.java
│   │   ├── DailyProgressRepository.java
│   │   └── AiCorrectionRepository.java
│   │
│   ├── entity/
│   │   ├── User.java
│   │   ├── VocabularyWord.java
│   │   ├── WritingNote.java
│   │   ├── SpeakingSession.java
│   │   ├── ReadingSession.java
│   │   ├── HomeworkTask.java
│   │   ├── Mistake.java
│   │   ├── DailyProgress.java
│   │   └── AiCorrection.java
│   │
│   ├── dto/
│   ├── security/
│   │   ├── JwtService.java
│   │   ├── JwtAuthFilter.java
│   │   ├── SecurityConfig.java
│   │   └── CustomUserDetailsService.java
│   │
│   ├── config/
│   │   ├── CorsConfig.java
│   │   └── WebClientConfig.java
│   │
│   └── exception/
│
├── src/main/resources/
│   ├── application.yml
│   └── application-dev.yml
│
├── pom.xml
└── Dockerfile optional
```

---

# 12. Frontend API Connection

## 12.1 Axios Client

```ts
// src/api/axiosClient.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 12.2 Writing API

```ts
// src/api/writingApi.ts
import { api } from "./axiosClient";

export const checkWriting = async (text: string) => {
  const response = await api.post("/api/writing/check", { text });
  return response.data;
};
```

---

## 12.3 Speaking API

```ts
// src/api/speakingApi.ts
import { api } from "./axiosClient";

export const analyzeSpeaking = async (question: string, transcript: string) => {
  const response = await api.post("/api/speaking/analyze", {
    question,
    transcript,
  });
  return response.data;
};
```

---

# 13. Browser SpeechRecognition Service

```ts
// src/services/speechRecognitionService.ts
export const createSpeechRecognition = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;

  return recognition;
};
```

Fallback message:

```text
Speech recognition is not supported in this browser. Please use Chrome for best experience.
```

---

# 14. Text-to-Speech Service

```ts
// src/services/textToSpeechService.ts
export const speakText = (text: string) => {
  if (!window.speechSynthesis) {
    alert("Text-to-speech is not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};
```

---

# 15. Backend Configuration

## 15.1 application.yml

```yml
server:
  port: ${PORT:8080}

spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000

external:
  languagetool:
    url: ${LANGUAGETOOL_API_URL:https://api.languagetool.org/v2/check}
  gemini:
    api-key: ${GEMINI_API_KEY:}
```

---

## 15.2 Environment Variables

Backend env:

```env
PORT=8080
DB_URL=jdbc:mysql://your-host:3306/english_learning
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_long_secret_key
LANGUAGETOOL_API_URL=https://api.languagetool.org/v2/check
GEMINI_API_KEY=optional_gemini_key
```

Frontend env:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Production frontend env:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

---

# 16. LanguageTool API Connection

Backend should call LanguageTool, not frontend.

API endpoint:

```text
POST https://api.languagetool.org/v2/check
```

Request content type:

```text
application/x-www-form-urlencoded
```

Parameters:

```text
text=I am go to market.
language=en-US
```

Example Java service idea:

```java
@Service
public class LanguageToolService {

    private final WebClient webClient;

    public LanguageToolService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.languagetool.org").build();
    }

    public String checkGrammar(String text) {
        return webClient.post()
                .uri("/v2/check")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters
                    .fromFormData("text", text)
                    .with("language", "en-US"))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
```

Important:

```text
Use only short text for free API.
Add rate limit handling.
If LanguageTool fails, return simple fallback correction message.
```

---

# 17. Gemini API Optional Connection

Gemini is optional. Website should work without Gemini.

Use Gemini for:

```text
Better sentence correction
Speaking feedback
Grammar explanation
Daily task generation
Weak area practice questions
```

Backend prompt example:

```text
You are an English speaking tutor for a beginner Hindi speaker.
Correct the following English answer.
Return JSON with correctedAnswer, mistakes, simpleExplanation and betterVersion.

Text: I am go to market.
```

Important:

```text
Never expose GEMINI_API_KEY in frontend.
Call Gemini only from Spring Boot backend.
Use fallback when quota is over.
```

---

# 18. Free Fallback Strategy

The app should never stop working because an AI API fails.

Fallback order:

```text
1. Gemini API if configured and available
2. LanguageTool API
3. Local rule-based correction
4. Save text without correction and tell user to retry later
```

Example fallback response:

```json
{
  "originalText": "I am go to market.",
  "correctedText": "Correction service is temporarily unavailable.",
  "mistakes": [],
  "message": "Your answer was saved. Please try correction again later."
}
```

---

# 19. Local Development Setup

## 19.1 Create Frontend

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install react-router-dom axios react-hook-form zod lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 19.2 Create Backend

Use Spring Initializr.

Select:

```text
Project: Maven
Language: Java
Spring Boot: latest stable
Java: 21
Dependencies:
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL Driver
- Validation
- Lombok
```

Backend runs on:

```text
http://localhost:8080
```

---

## 19.3 Local MySQL Setup

Create database:

```sql
CREATE DATABASE english_learning;
```

Local backend env:

```env
DB_URL=jdbc:mysql://localhost:3306/english_learning
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

---

# 20. Deployment Plan

## Recommended Deployment

```text
Frontend: Vercel or Netlify
Backend: Render or Koyeb
Database: Aiven MySQL free tier
```

## 20.1 Frontend Deployment: Vercel

Steps:

```text
1. Push frontend folder to GitHub.
2. Import project in Vercel.
3. Set build command: npm run build
4. Set output directory: dist
5. Add env variable: VITE_API_BASE_URL=https://your-backend-url
6. Deploy.
```

## 20.2 Frontend Deployment: Netlify

Steps:

```text
1. Push frontend folder to GitHub.
2. Import project in Netlify.
3. Build command: npm run build
4. Publish directory: dist
5. Add env variable: VITE_API_BASE_URL=https://your-backend-url
6. Add SPA redirect rule if using React Router.
```

Netlify redirect file:

```text
public/_redirects
```

Content:

```text
/* /index.html 200
```

---

## 20.3 Backend Deployment: Render

Steps:

```text
1. Push backend folder to GitHub.
2. Create new Web Service on Render.
3. Connect GitHub repo.
4. Set root directory: backend
5. Build command: ./mvnw clean package -DskipTests
6. Start command: java -jar target/*.jar
7. Add environment variables.
8. Deploy.
```

Note:

```text
Render free web service may sleep after inactivity.
First request after sleep can be slow.
```

---

## 20.4 Backend Deployment: Koyeb

Steps:

```text
1. Push backend to GitHub.
2. Create Koyeb service.
3. Select GitHub repository.
4. Choose Java/Spring Boot build.
5. Add environment variables.
6. Deploy.
```

---

## 20.5 Database Deployment: Aiven MySQL

Steps:

```text
1. Create Aiven account.
2. Create MySQL free service.
3. Copy host, port, database, username, password.
4. Convert to JDBC URL.
5. Add DB_URL, DB_USERNAME, DB_PASSWORD in backend hosting env.
```

JDBC URL example:

```text
jdbc:mysql://HOST:PORT/defaultdb?ssl-mode=REQUIRED
```

---

# 21. UI Design Requirements

Design should be:

```text
Clean
Motivating
Mobile responsive
Beginner friendly
English learning focused
Not plain
```

Suggested theme:

```text
Primary color: Blue / Purple / Green
Background: Light gradient
Cards: Rounded corners
Progress: Circular progress / bars
Buttons: Clear CTA
```

Mobile-first pages:

```text
Dashboard cards stack vertically
Large speaking button
Easy navigation bottom bar
Readable text size
```

---

# 22. Mobile and Browser Support

Must support:

```text
Chrome desktop
Chrome mobile
Edge desktop
Android browser best effort
```

SpeechRecognition fallback:

```text
If browser does not support voice input, allow manual typing.
```

Text-to-speech fallback:

```text
If voice output not supported, show correct text only.
```

---

# 23. Browser Navigation Features

Add:

```text
Back button
Continue previous lesson
Resume last activity
Open practice in new tab
Save last page
```

Frontend examples:

```ts
window.open("/speaking", "_blank");
navigate(-1);
localStorage.setItem("lastPage", location.pathname);
```

---

# 24. Progress and Streak Logic

Daily progress should update when user completes:

```text
Add vocabulary word
Write sentence/note
Complete speaking answer
Complete reading paragraph
Submit homework
Fix mistake
```

Streak logic:

```text
If user completes minimum daily score >= 60, count as active day.
If user misses a day, streak resets.
```

Minimum daily completion:

```text
At least 1 speaking OR 1 writing
AND daily score >= 60
```

---

# 25. AI Feedback Rules

Feedback should be simple and beginner friendly.

Bad feedback:

```text
Your syntax is invalid due to incorrect auxiliary usage.
```

Good feedback:

```text
Use "going" after "am". Correct sentence: I am going to the market.
```

Always show:

```text
Wrong sentence
Correct sentence
Simple rule
Repeat button
Save to mistakes
```

---

# 26. MVP Development Phases

## Phase 1: Basic Full-Stack Setup

Build:

```text
React Vite setup
Spring Boot setup
MySQL connection
Register/login
JWT auth
Dashboard layout
```

---

## Phase 2: Core Learning Features

Build:

```text
Vocabulary CRUD
Writing notebook
Today progress
Mistake history
Homework basic
```

---

## Phase 3: Speaking and Reading

Build:

```text
SpeechRecognition service
Text-to-speech service
Speaking practice page
Reading practice page
Transcript save
Accuracy calculation
```

---

## Phase 4: AI Integration

Build:

```text
LanguageTool backend integration
Writing correction
Speaking correction
Mistake extraction
Optional Gemini integration
Fallback logic
```

---

## Phase 5: Smart Practice

Build:

```text
Weak area detection
Daily task generation
Roadmap
Repeated mistake practice
Weekly progress report
```

---

## Phase 6: Deployment

Deploy:

```text
Frontend to Vercel/Netlify
Backend to Render/Koyeb
Database to Aiven MySQL
Configure CORS
Configure env variables
Test production APIs
```

---

# 27. Testing Checklist

## Auth

```text
User can register
User can login
JWT token saved
Protected pages require login
Logout works
```

## Dashboard

```text
Today goal visible
Today progress updates
Streak visible
Weak area visible
```

## Vocabulary

```text
Add word
Edit word
Delete word
Mark learned
Mark weak
Pronunciation works
```

## Writing

```text
Create note
Check grammar
Show correction
Save mistake
Read corrected text aloud
```

## Speaking

```text
Start speaking works in Chrome
Transcript appears
Analyze button works
Correction appears
History saves
Retry works
```

## Reading

```text
Paragraph shown
Voice transcript captured
Expected vs spoken compared
Missing words shown
Accuracy saved
```

## Homework

```text
Today homework visible
Submit homework
Mark completed
Progress updates
```

## AI

```text
LanguageTool API works
Gemini optional works if key exists
Fallback works if API fails
No API key exposed in frontend
```

## Deployment

```text
Frontend production works
Backend production works
MySQL production connected
CORS configured
Environment variables configured
```

---

# 28. Common Problems and Solutions

## Problem: CORS error

Solution:

```text
Allow frontend URL in Spring Boot CORS config.
```

## Problem: SpeechRecognition not working

Solution:

```text
Use Chrome.
Allow microphone permission.
Provide typing fallback.
```

## Problem: Backend works locally but not deployed

Solution:

```text
Check PORT env.
Check DB URL.
Check MySQL SSL settings.
Check logs.
```

## Problem: LanguageTool API limit reached

Solution:

```text
Limit grammar check button clicks.
Check short text only.
Add retry later message.
Use Gemini fallback if available.
```

## Problem: Vite React Router gives 404 on refresh

Solution:

```text
Add Netlify _redirects or Vercel rewrite.
```

---

# 29. Security Rules

```text
Hash passwords using BCrypt.
Use JWT for authentication.
Do not expose backend secrets.
Do not expose Gemini API key in frontend.
Validate all user input.
Protect all user-specific APIs.
Use HTTPS in production.
Set CORS only for your frontend domain.
```

---

# 30. Final Free-First Feature List

The final free-first version should include:

```text
React + Vite responsive frontend
Java Spring Boot backend
MySQL database
JWT login/register
Dashboard
Today progress
Daily practice
Speaking practice
Reading practice
Writing notebook
Vocabulary manager
Grammar practice
Homework
Mistake history
Weak area suggestion
Roadmap
Browser voice-to-text
Browser text-to-speech
LanguageTool grammar check
Optional Gemini AI helper
Easy deployment setup
```

---

# 31. Final Recommended Deployment Stack

Best practical setup:

```text
Frontend: Vercel
Backend: Render or Koyeb
Database: Aiven MySQL
```

Alternative:

```text
Frontend: Netlify
Backend: Railway
Database: Railway MySQL / Aiven MySQL
```

Important:

```text
Frontend and backend deploy separately.
Database deploy separately.
Frontend calls backend using VITE_API_BASE_URL.
Backend connects to MySQL using environment variables.
```

---

# 32. Source References

These official docs were used to decide technology and deployment approach:

- React build tool guidance: https://react.dev/learn/build-a-react-app-from-scratch
- Vite guide: https://vite.dev/guide/
- Vite static deployment: https://vite.dev/guide/static-deploy
- Spring REST services guide: https://spring.io/guides/tutorials/rest
- Spring Boot SQL database docs: https://docs.spring.io/spring-boot/reference/data/sql.html
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Spring Boot with MySQL guide: https://spring.io/guides/gs/accessing-data-mysql/
- Spring Boot deployment docs: https://docs.spring.io/spring-boot/how-to/deployment/index.html
- MDN Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- MDN SpeechRecognition: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- MDN SpeechSynthesis: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- LanguageTool API docs: https://languagetool.org/http-api/
- LanguageTool public API limits: https://dev.languagetool.org/public-http-api.html
- Gemini API pricing/free tier: https://ai.google.dev/gemini-api/docs/pricing
- Vercel Hobby plan: https://vercel.com/docs/plans/hobby
- Netlify Vite deployment: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/
- Render free web services: https://render.com/docs/free
- Aiven MySQL free tier: https://aiven.io/docs/products/mysql/concepts/mysql-free-tier
- Koyeb Spring Boot deployment: https://www.koyeb.com/docs/deploy/spring-boot
- Railway Spring Boot deployment: https://docs.railway.com/guides/spring-boot

---

# 33. Final Summary

This project should be built as a complete English speaking learning system, not just a normal grammar checker.

The main goal is to create daily practice discipline.

The website should help the user by:

```text
Giving daily tasks
Saving all practice
Checking writing
Checking speaking transcript
Tracking mistakes
Repeating weak topics
Showing today progress
Building streak
Giving homework
Improving confidence
```

Selected stack:

```text
Frontend: React + Vite + TypeScript + Tailwind CSS
Backend: Java + Spring Boot
Database: MySQL
AI/free tools: Web Speech API + LanguageTool + optional Gemini
Deploy: Vercel/Netlify + Render/Koyeb + Aiven MySQL
```
