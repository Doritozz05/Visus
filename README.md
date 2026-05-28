# Visus 👁️ - Advanced Speed Reading & Multi-Device PWA

Visus is an open-source, high-performance speed reading and peripheral vision training platform. Designed from day one around low latency cognitive consumption, Visus functions natively offline as a Progressive Web App (PWA) on both mobile (on-the-go training) and desktop (deep focus reading) screens.

By integrating state-of-the-art RSVP (Rapid Serial Visual Presentation) visual focus anchoring (ORP - Optimal Recognition Point) and syntactic visual chunking (Cúmulos) algorithms, Visus reduces subvocalization rates, helping you double your visual reading speed without sacrificing comprehension.

---

## 🏛️ System Architecture

Visus uses a hybrid architecture combining **Clean Architecture** and **Feature-Driven Development (FDD)**. This separation of concerns ensures that the reading engines are 100% UI and framework-independent, while new user interfaces remain modular and self-contained.

### Visual Architecture Flow Diagram

```text
┌────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                      │
│                  (Next.js App Router)                  │
│                                                        │
│            ┌────────────────────────────┐              │
│            │        src/app/            │              │
│            │   (Layouts, Pages, SEO)    │              │
│            └─────────────┬──────────────┘              │
└──────────────────────────┼─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                   │
│            (Feature-Driven Development / UI)           │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │                 src/features/                  │   │
│   │  ┌───────────────┐ ┌───────────────┐ ┌────────┐│   │
│   │  │  reader-rsvp/ │ │reader-clusters│ │  ...   ││   │
│   │  └───────┬───────┘ └───────┬───────┘ └────────┘│   │
│   └──────────┼─────────────────┼───────────────────┘   │
│              ▼                 ▼                       │
│   ┌────────────────────────────────────────────────┐   │
│   │                 src/components/                │   │
│   │            (Atomic Shared UI Components)       │   │
│   └────────────────────────────────────────────────┘   │
└───────────────────────────────────┬────────────────────┘
                                    │ (Utilizes hooks/contexts)
                                    ▼
┌────────────────────────────────────────────────────────┐
│                  LOGIC & STATE LAYER                   │
│         (React Hooks, Contexts & Integrations)         │
│                                                        │
│     ┌────────────────────────┐┌──────────────────┐     │
│     │      src/hooks/        ││   src/context/   │     │
│     │  (use-player, etc.)    ││ (reader-context) │     │
│     └───────────┬────────────┘└────────┬─────────┘     │
└─────────────────┼──────────────────────┼───────────────┘
                  │                      │ (Decoupled access)
                  ▼                      ▼
┌────────────────────────────────────────────────────────┐
│                       CORE LAYER                       │
│          (Domain Model / Framework Agnostic)           │
│                                                        │
│     ┌────────────────────────────────────────────┐     │
│     │                 src/core/                  │     │
│     │   ┌─────────────────┐ ┌────────────────┐   │     │
│     │   │   algorithms/   │ │   entities/    │   │     │
│     │   │ (rsvp, clusters)│ │ (reader, text) │   │     │
│     │   └─────────────────┘ └────────────────┘   │     │
│     └────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

### Architectural Layering Guidelines:
1. **Core (Domain)**: Located in `src/core`. Exposes mathematical calculations, algorithms, and type definitions for RSVP and Clusters. **Zero framework dependencies** (no React/Next imports allowed).
2. **Features**: Located in `src/features`. Each functional module (Dashboard, Settings, RSVP Reader, etc.) groups its own localized views, state contexts, and component utilities.
3. **Components (UI)**: Atomic, reusable styling templates built using Radix and Shadcn aliases (`src/components/ui`).
4. **Hooks/Contexts**: Global state managers that track speed-reading preferences, streaks, stats, and real-time playback updates.
5. **App (Client Gateway)**: Layout wrappers, client-side PWA service worker registrations, and viewport management.

---

## 🛠️ Technological Foundation

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict compilation check)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) (Custom HSL themes for Sepia, Nordic, and Clinical Dark Mode)
- **UI Kit**: [Shadcn UI](https://ui.shadcn.com/) (Alias support via `components.json`)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (High refresh rate micro-interactions)
- **PWA**: Custom service worker intercepting offline assets with standalone viewport configurations.

---

## 🚀 Step-by-Step Installation

Follow these instructions to clone, construct, and initialize the Visus environment.

### 1. Requirements
Ensure your environment meets the minimum version guidelines:
- **Node.js**: LTS recommended (>= `18.x`, fully tested on `24.x`)
- **NPM** (standard wrapper) or **pnpm**
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/visus.git
cd visus
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Local Development Server
Launch the compiler and hot-reloader:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the welcoming high-fidelity dashboard shell.

### 5. Validate TypeScript Compilations
To trigger strict type checks:
```bash
npm run typecheck
```

### 6. Build Production Bundle
To compile and test static PWA assets locally:
```bash
npm run build
```

---

## 📏 Code Contribution Standards

Visus aims for world-class technical execution. We ask contributors to adhere to the following rules:
- **Strict TSDoc**: Any exported types, helper algorithms, or domain objects must feature JSDocs detailing arguments, formulas, and rationale.
- **Strict Decoupling**: Do not import React components or browser APIs into `src/core`. Keep mathematical speed computations completely pure.
- **Mobile-First Responsive Layouts**: Ensure interfaces behave fluidly on compact phone displays up to multi-monitor setups.
