# Project X — Frontend Web Portal

High-performance Next.js 16 (App Router) frontend for Project X Single-Box SOC.

## Features
- **Void Black Theme & Rich Aesthetics**: Glassmorphic panels, subtle glow effects, responsive high-tech telemetry.
- **Hero Section**: Live network status, 10-step autonomous loop visualization, and one-click demo replay launcher.
- **Role-Based Access Control**:
  - **Employee / Receptionist Portal**: Plain-English security bulletins, business-impact summaries, and restricted 403 response gates.
  - **Admin Command Center**: Multi-incident dossiers, NetworkX attack graphs (8 events &rarr; 1 incident), 3-act chronological timelines, raw log grep inspectors, and the 2-step approval/firewall containment gate.
- **MITRE Caldera Verification Proof**: Interactive visualizer showing re-attack execution on port 22 and mathematical proof of containment.
- **Contract #2 Compliant**: Fully integrated with FastAPI backend (`http://127.0.0.1:8000`), with an automatic graceful fallback to mock data when running standalone.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

## Environment Variables
Create `.env.local` (optional):
```bash
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```
