# Contributing to Visus 👁️

Thank you for your interest in contributing to Visus! We want to keep this project clean, simple, and high-quality. Following these guidelines helps ensure a smooth contribution process for everyone.

---

## How to contribute

You can contribute in several ways:
* **Report bugs**: If you find an issue, open a bug report issue.
* **Suggest features**: Have an idea to make Visus better? Submit a feature request issue.
* **Code changes**: Fix an open issue or implement an approved feature by submitting a pull request.

---

## Development setup

Follow these steps to set up your local development environment:

### 1. Fork and clone
Fork the repository on GitHub, then clone your fork locally:
```bash
git clone https://github.com/<your-username>/Visus.git
cd Visus
```

### 2. Install dependencies
Install Node.js packages:
```bash
npm install
```

### 3. Run the development server
Start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Verify code quality
Before submitting any changes, make sure the codebase compiles without warnings or errors:
```bash
npm run typecheck
```

---

## Coding standards

To maintain high code quality, please adhere to these strict rules:

### 1. Language constraint
* **English only**: All code variables, comments, commit messages, issues, and pull requests must be written in English. Spanish or other languages are prohibited.

### 2. Sentence casing
* **Strict casing**: Headings, labels, buttons, and UI strings must strictly use sentence casing (only capitalize the first letter of a sentence/heading and approved acronyms). Title Case is prohibited.
* **Approved acronyms**: Capitalize acronyms like WPM, PWA, RSVP, ORP, PDF, EPUB, and IDE.

### 3. Architecture
* Keep pure reading algorithms separated in `src/core/algorithms/` with zero framework or UI dependencies.
* Build features inside the modular directory `src/features/`.
