# Network Topology Visualization

A modern, interactive web application for designing and visualizing network topologies, inspired by Cisco Packet Tracer and Stitch design. Built with React, FastAPI, and NetworkX.

## Live Features

- **Interactive canvas** - React Flow with drag-and-drop node placement, pan, zoom, fit-to-screen
- **Device palette** - Router, Switch, Desktop PC, Laptop, Server with SVG icons
- **Add Device dialog** - name validation, duplicate detection, instant canvas placement
- **Connect mode** - click-to-connect with duplicate and self-loop prevention
- **Delete mode** - click to remove devices or connections; Delete key shortcut
- **Undo / Redo** - full history across all topology changes
- **Properties inspector** - edit device name, IP address, MAC address
- **Persistent save** - Save button writes to backend/data/topology.json; restored on backend restart
- **Import / Export** - JSON and CSV export; JSON import with validation
- **Status bar** - live device and connection counts

## Quick Start (Windows)

### Prerequisites
- Python 3.10+ - https://python.org
- Node.js 18+ - https://nodejs.org

### Backend (Terminal 1)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Backend: http://localhost:8000
Swagger docs: http://localhost:8000/docs

### Frontend (Terminal 2)

```powershell
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

---

## Project Structure

```
Network-Topology-Visualization/
|-- backend/
|   |-- main.py                  # Entry point - loads saved topology on startup
|   |-- requirements.txt
|   |-- data/                    # Runtime persistence (topology.json)
|   +-- app/
|       |-- graph.py             # NetworkX graph + save/load
|       |-- models.py            # Pydantic models
|       +-- routes/
|           |-- devices.py
|           |-- connections.py
|           |-- topology.py      # Save, load, reset, demo
|           +-- import_export.py
|
|-- frontend/
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js
|   +-- src/
|       |-- App.tsx
|       |-- api/client.ts
|       |-- store/useTopologyStore.ts
|       +-- components/
|           |-- TopologyCanvas.tsx
|           |-- Toolbar.tsx
|           |-- DevicePalette.tsx
|           |-- PropertiesPanel.tsx
|           |-- StatusBar.tsx
|           |-- AddDeviceDialog.tsx
|           +-- DeviceIcon.tsx
|
|-- backups/                     # Original files before changes
|-- stitch_nettopology_designer/ # Design reference
+-- .gitignore
```

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Canvas | React Flow |
| State | Zustand |
| Styling | Tailwind CSS (Stitch design tokens) |
| Backend | FastAPI + Uvicorn |
| Graph engine | NetworkX |
| Persistence | JSON file (backend/data/topology.json) |

### API Endpoints

| Group | Endpoints |
|---|---|
| Devices | GET/POST /devices, GET/PUT/DELETE /devices/{id} |
| Connections | GET/POST /connections, DELETE /connections/{id} |
| Topology | GET /topology, POST /topology/save, /load, /reset, /load-demo |
| Import/Export | GET /export/json, /export/csv/devices, POST /import/json |
| Health | GET /health |

---

## Persistence

Saving writes the full topology to backend/data/topology.json.

On backend restart, main.py checks for this file:
- File exists: restores saved topology
- File missing or corrupt: loads the default demo topology

---

## Demo Topology

```
       R1 (Router)
      /            \
   S1 (Switch)   S2 (Switch)
   /    \              \
 PC1    PC2            PC3
```

Connections: R1-S1, R1-S2, S1-PC1, S1-PC2, S2-PC3

---

## Design System (Stitch)

- Primary: #004ac6
- Router icon: blue #3B82F6
- Switch icon: purple #8B5CF6
- Desktop icon: red #EF4444
- Laptop icon: amber #F59E0B
- Server icon: green #10B981
- Grid: 24px, Base unit: 4px

---

## Troubleshooting

Backend won't start:
```powershell
python --version          # needs 3.10+
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Frontend won't start:
```powershell
node --version            # needs 18+
npm install
npm run dev
```

CORS errors: ensure backend is running on port 8000 before starting the frontend.

---

## Original Files

Preserved in backups/:
- backups/main.py.backup - original NetworkX visualization
- backups/device.csv.backup - original data file

---

## License

College computer networking project.