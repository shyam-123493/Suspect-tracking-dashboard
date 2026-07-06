# Suspect Tracking Dashboard

A police investigation dashboard built with **Angular 19** for tracking suspects, visualizing their movements on an interactive map, analyzing associate networks, and managing cases and alerts. All data is simulated (dummy data) — no backend is required, making it ideal for demos and prototyping.

## Features

- **Dashboard** — At-a-glance overview with key stats and charts (Chart.js / ng2-charts)
- **Investigation Map** — Interactive Leaflet map with marker clustering and heatmap layers to visualize suspect locations and movement
- **Suspects** — Searchable suspect list with detailed profiles including travel history, call history, and known associations
- **Network Graph** — D3-powered graph visualizing relationships between suspects and their associates
- **Alerts** — Zone-based alerts when suspects enter monitored areas
- **Cases** — Case management view linking suspects and investigations
- **Authentication** — Simulated login with route guards (any username with a password of 4+ characters works)
- **Live Simulation** — A simulation service generates ongoing location updates to mimic real-time tracking

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 (standalone components, lazy-loaded routes) |
| UI | Angular Material + Angular CDK, SCSS |
| Maps | Leaflet, leaflet.heat, leaflet.markercluster |
| Charts | Chart.js, ng2-charts |
| Network graph | D3.js |
| State / async | RxJS |
| Testing | Jasmine + Karma |

## Getting Started

### Prerequisites

- Node.js 18.19+ (or 20.11+)
- npm

### Installation

```bash
git clone <repository-url>
cd Suspect-tracking-dashboard
npm install
```

### Development server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app reloads automatically when you change source files.

Log in with any username and a password of at least 4 characters (auth is simulated and stored in `localStorage`).

### Production build

```bash
npm run build
```

Build artifacts are output to `dist/police-dashboard/`. The project is configured for deployment on **Vercel**.

### Running tests

```bash
npm test
```

## Project Structure

```
src/app/
├── core/
│   ├── guards/          # authGuard for protected routes
│   └── services/        # auth, suspect, case, alert, location, simulation
├── features/
│   ├── auth/            # Login page
│   ├── dashboard/       # Dashboard home with stats & charts
│   ├── map/             # Investigation map (Leaflet)
│   ├── suspects/        # Suspect list & profile pages
│   ├── network/         # D3 network graph
│   ├── alerts/          # Alerts list
│   └── cases/           # Cases list
├── layout/
│   └── shell/           # App shell (nav, layout) wrapping authed routes
└── shared/
    ├── interfaces/      # Suspect, Case, Alert, Zone, TravelHistory, etc.
    └── utils/           # Dummy data generation, geolocation helpers
```

## Routes

| Path | Description |
|---|---|
| `/login` | Login page (public) |
| `/dashboard` | Overview dashboard (default) |
| `/map` | Investigation map |
| `/suspects` | Suspect list |
| `/suspects/:id` | Suspect profile |
| `/network` | Association network graph |
| `/alerts` | Alerts list |
| `/cases` | Cases list |

All routes except `/login` are protected by `authGuard` and lazy-loaded.

## Disclaimer

This application uses entirely fictional, randomly generated data. It is a demo/prototype and is not connected to any real law-enforcement system.
