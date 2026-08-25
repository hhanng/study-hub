# Study Hub

A homework, exam, and study tracker — React + Vite, plain CSS, deployed to GitHub Pages.

## Getting started

```bash
npm install
npm run dev
```

## Things to edit later

Three spots are meant to be filled in by hand after the app is built:

1. **Real class schedule** — [src/data/seedData.js](src/data/seedData.js). Replace the placeholder
   `weeklySchedule` (and `subjects`/`subjectColors` if the classes change) with the real weekly schedule.
2. **Syllabus/notes content** — open the app's **Syllabus** tab and paste in the real syllabus/notes
   per class. It's saved automatically to the browser (localStorage), no file to edit.
3. **Gemini API key** — open [.env.local](.env.local) and paste a real key after `VITE_GEMINI_API_KEY=`
   (get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)). It's read at
   build time, so it works for local `npm run dev` automatically. To have it baked into the deployed
   GitHub Pages site too (so she never has to enter anything), add the same value as a repository
   secret named `VITE_GEMINI_API_KEY` — see **Settings → Secrets and variables → Actions → New
   repository secret** on GitHub. The deploy workflow already reads it from there.

## Deploying

Every push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which
builds the app and publishes it to GitHub Pages. Enable Pages once in the repo:
**Settings → Pages → Source: GitHub Actions**.

## Data storage

Homework, exams, notes, flashcards, and quiz history all live in the browser's localStorage —
there's no backend. The only network calls are to the Gemini API, and only when generating
flashcards, quizzes, or practice problems.
