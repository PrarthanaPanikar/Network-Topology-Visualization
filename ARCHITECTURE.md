# Network Topology Editor - Architecture Proposal

## Overview
A modern, interactive web application for network topology design and visualization, inspired by Cisco Packet Tracer and the Google Stitch design system. Built with React/TypeScript frontend and FastAPI/Python backend.

---

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **React Flow** for the topology canvas (nodes, edges, drag-drop, zoom/pan)
- **Tailwind CSS** for styling (using Stitch design tokens)
- **Zustand** for lightweight state management
- **Axios** for HTTP API calls
- **Material Symbols** icons for toolbar actions

### Backend
- **FastAPI** for REST API
- **NetworkX** for graph representation and operations
- **Pydantic** for data validation
- **Python 3.10+**
- **Uvicorn** as ASGI server

### Shared
- **JSON** for configuration import/export
- **CSV** for device/connection data export
- **Demo topology**: R1, S1, S2, PC1, PC2, PC3 (5 connections)

---

## Project Directory Structure

```
Network-Topology-Visualization/
│
├── main.py                          (PRESERVED: Original NetworkX visualization)
├── device.csv                       (PRESERVED: Existing data file)
├── ARCHITECTURE.md                  (THIS FILE)
│
├── backend/
│   ├── main.py                      (FastAPI entry point)
│   ├── requirements.txt             (Python dependencies)
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── graph.py                 (NetworkX graph operations)
│   │   ├── models.py                (Pydantic data models)
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── devices.py           (Device CRUD endpoints)
│   │       ├── connections.py       (Connection CRUD endpoints)
│   │       ├── topology.py          (Graph state and export endpoints)
│   │       └── import_export.py     (JSON/CSV import/export)
│   │
│   └── tests/
│       └── test_graph.py            (Unit tests for graph operations)
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   │
│   ├── src/
│   │   ├── main.tsx                 (Entry point)
│   │   ├── App.tsx                  (Root component)
│   │   ├── index.css                (Global styles + Tailwind)
│   │   │
│   │   ├── api/
│   │   │   └── client.ts            (Axios instance and API hooks)
│   │   │
│   │   ├── components/
│   │   │   ├── Toolbar.tsx          (Top toolbar with tools)
│   │   │   ├── DevicePalette.tsx    (Left sidebar device list)
│   │   │   ├── TopologyCanvas.tsx   (React Flow canvas)
│   │   │   ├── PropertiesPanel.tsx  (Right-side inspector)
│   │   │   ├── StatusBar.tsx        (Bottom status bar)
│   │   │   │
│   │   │   └── nodes/
│   │   │       ├── DeviceNode.tsx   (React Flow node component)
│   │   │       ├── RouterNode.tsx   (Router with SVG)
│   │   │       ├── SwitchNode.tsx   (Switch with SVG)
│   │   │       ├── PCNode.tsx       (Desktop/Laptop with SVG)
│   │   │       └── ServerNode.tsx   (Server with SVG)
│   │   │
│   │   └── svg/
│   │       ├── RouterIcon.tsx       (SVG component)
│   │       ├── SwitchIcon.tsx       (SVG component)
│   │       ├── DesktopIcon.tsx      (SVG component)
│   │       ├── LaptopIcon.tsx       (SVG component)
│   │       └── ServerIcon.tsx       (SVG component)
│   │
│   ├── store/
│   │   └── useTopologyStore.ts      (Zustand state: nodes, edges, undo/redo)
│   │
│   └── utils/
│       ├── api.ts                   (API call helpers)
│       ├── export.ts                (JSON/CSV export utilities)
│       └── layout.ts                (Graph layout helpers)
│
├── stitch_nettopology_designer/     (PRESERVED: Design reference)
│   ├── code.html
│   ├── DESIGN.md
│   └── screen.png
│
└── README.md                        (Setup and launch instructions)
```

---

## Component Architecture

### Frontend Components

#### **1. Toolbar (Top, ~48px)**
- **Select Tool** (default): Click to select nodes/edges
- **Add Device Tool**: Opens device type selector
- **Connect Tool**: Click two nodes to create edge
- **Delete Tool**: Click node/edge to delete
- **Undo/Redo buttons**: History navigation
- **Zoom Out/In buttons**: Canvas zoom control
- **Fit to Screen button**: Auto-fit viewport
- **Snap to Grid toggle**: Alignment helper
- **Save button**: Export current topology

#### **2. Device Palette (Left, 175px)**
- **Routers** section
  - Cisco ISR 2911 (default)
  - Cloud WAN
- **Switches** section
  - Catalyst 2960 (default)
  - Catalyst 3560
- **End Devices** section
  - Desktop Workstation
  - Laptop PC
  - Enterprise Server
  - Network Printer
- **"+ More Hardware"** button for expansion

#### **3. Topology Canvas (Center, flex-grow)**
- **React Flow canvas** with:
  - White background (#FFFFFF)
  - Grid pattern (24px) in light blue (#E8EDF4)
  - Draggable nodes (devices)
  - Connectable edges (lines)
  - Right-click context menu for node actions
  - Zoom/pan support
  - Auto-layout on load

#### **4. Properties Inspector (Right, collapsible 320px)**
- **Device Properties** (when node selected):
  - Device name (editable text field)
  - Device type (read-only label)
  - IP address (editable, optional)
  - MAC address (editable, optional)
  - Connected interfaces (list)
  - Delete button
  - Duplicate button
- **Connection Properties** (when edge selected):
  - Source device
  - Target device
  - Connection speed (Gigabit / FastEthernet)
  - Status (UP/DOWN)
  - Delete button

#### **5. Status Bar (Bottom, ~40px)**
- Left: "Devices: 6 | Connections: 5 | Selected: R1"
- Right: "Zoom: 100% | Cursor: X, Y"
- Zoom percentage display

---

## Data Models (Backend)

### Device
```python
class Device(BaseModel):
    id: str                    # Unique identifier (e.g., "node-1")
    name: str                  # Display name (e.g., "R1")
    device_type: str          # "router" | "switch" | "pc" | "server"
    position: Dict[str, float] # {"x": 100, "y": 200}
    ip_address: Optional[str]  # "192.168.1.1"
    mac_address: Optional[str] # "aa:bb:cc:dd:ee:ff"
```

### Connection
```python
class Connection(BaseModel):
    id: str                    # Unique identifier (e.g., "edge-1")
    source: str               # Source device ID
    target: str               # Target device ID
    speed: str                # "gigabit" | "fastethernet"
    status: str               # "up" | "down"
```

### Topology
```python
class Topology(BaseModel):
    name: str
    devices: List[Device]
    connections: List[Connection]
    metadata: Dict             # Version, created_at, updated_at
```

---

## API Endpoints (Backend)

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create device
- `GET /api/devices/{id}` - Get device by ID
- `PUT /api/devices/{id}` - Update device
- `DELETE /api/devices/{id}` - Delete device
- `POST /api/devices/{id}/duplicate` - Duplicate device

### Connections
- `GET /api/connections` - List all connections
- `POST /api/connections` - Create connection
- `GET /api/connections/{id}` - Get connection by ID
- `PUT /api/connections/{id}` - Update connection
- `DELETE /api/connections/{id}` - Delete connection
- `GET /api/devices/{id}/neighbors` - Get connected neighbors

### Topology
- `GET /api/topology` - Get full topology state
- `POST /api/topology/load` - Load demo or uploaded topology
- `POST /api/topology/reset` - Reset to demo topology

### Import/Export
- `GET /api/export/json` - Export topology as JSON
- `GET /api/export/csv/devices` - Export devices as CSV
- `GET /api/export/csv/connections` - Export connections as CSV
- `POST /api/import/json` - Import topology from JSON
- `POST /api/import/csv` - Import from CSV files

---

## State Management (Frontend - Zustand)

```typescript
interface TopologyStore {
  // State
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  tool: "select" | "add" | "connect" | "delete";
  zoom: number;
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;

  // Actions
  addNode(node: Node): void;
  updateNode(id: string, updates: Partial<Node>): void;
  deleteNode(id: string): void;
  addEdge(edge: Edge): void;
  deleteEdge(id: string): void;
  selectNode(id: string | null): void;
  selectEdge(id: string | null): void;
  setTool(tool: string): void;
  setZoom(zoom: number): void;
  undo(): void;
  redo(): void;
  loadTopology(devices: Device[], connections: Connection[]): void;
}
```

---

## Design System Integration (from Stitch DESIGN.md)

### Colors (Tailwind Configuration)
```javascript
colors: {
  "primary": "#004ac6",        // Main blue
  "secondary": "#a73a00",      // Router orange
  "tertiary": "#6a1edb",       // Server purple
  "router": "#ea580c",         // Router color
  "switch": "#2563eb",         // Switch blue
  "enddevice": "#16a34a",      // End device green
  "error": "#ba1a1a",          // Error red
  "surface": "#f8f9ff",        // Background
  "on-surface": "#0d1c2f"      // Text
}
```

### Typography (Tailwind)
- **Headings**: Inter, 600 weight, sizes 15px–24px
- **Body text**: Inter, 400 weight, 12px–14px
- **Technical labels**: JetBrains Mono, 10px–13px

### Spacing
- Grid: 24px
- Base gap: 4px (space-xs), 8px (space-md), 12px (space-lg)

### Border Radius
- Containers: 4px (rounded-md)
- Full: 24px (rounded-full)

---

## Development Workflow

### Phase 1: Setup & Scaffolding (Task #1–#5)
1. Create backend FastAPI project structure
2. Initialize React + Vite frontend
3. Create SVG component library for devices
4. Set up Tailwind CSS with Stitch color tokens

### Phase 2: UI Layout (Task #6–#10)
1. Build Toolbar component
2. Build DevicePalette component
3. Implement React Flow canvas with grid
4. Build PropertiesPanel and StatusBar
5. Add basic styling and layout

### Phase 3: Core Features (Task #11–#15)
1. Device management (CRUD)
2. Connection management (create/delete)
3. Interactive tools (select, add, connect, delete)
4. Undo/redo with history
5. Load demo topology

### Phase 4: Backend Integration (Task #16–#17)
1. Implement FastAPI endpoints
2. Connect frontend API calls to backend
3. Validate data flow

### Phase 5: Polish & Testing (Task #18–#19)
1. End-to-end testing
2. Error handling and validation
3. Documentation and Windows setup guide

---

## Key Design Decisions

1. **React Flow over Plotly**: Provides true interactive canvas like Packet Tracer with drag-drop, selection, and connection editing.
2. **Zustand over Redux**: Lightweight state management suitable for this scope.
3. **FastAPI over Express**: Type safety with Pydantic, built-in documentation with Swagger.
4. **Preserved main.py**: Your original NetworkX visualization remains untouched in the project root.
5. **Design tokens from Stitch**: Colors, typography, spacing directly implemented in Tailwind config.

---

## Success Criteria

- ✅ Interactive canvas with draggable devices
- ✅ Left palette with drag-drop device placement
- ✅ Right properties panel with editable fields
- ✅ Full CRUD operations on devices and connections
- ✅ Undo/redo functionality
- ✅ Import/export JSON and CSV
- ✅ Demo topology loads on startup (R1, S1, S2, PC1, PC2, PC3)
- ✅ Add PC4 → connect to S2 workflow functional
- ✅ Professional UI matching Stitch design
- ✅ Windows installation and launch commands documented

---

## Next Steps

1. **Your Review**: Confirm this architecture aligns with your vision.
2. **Modifications**: Suggest any changes before implementation.
3. **Implementation**: Once approved, proceed with Phase 1 (Setup & Scaffolding).

