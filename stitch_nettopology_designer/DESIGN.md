---
name: Technical Precision Network Simulator
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#434655'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#6a1edb'
  on-tertiary: '#ffffff'
  tertiary-container: '#8343f4'
  on-tertiary-container: '#f7edff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.5rem
  margin: 0.75rem
  space-xs: 0.125rem
  space-sm: 0.25rem
  space-md: 0.5rem
  space-lg: 0.75rem
  space-xl: 1rem
---

## Brand & Style
The design system delivers an exacting, high-density environment engineered for network architects, systems engineers, and students. Emphasizing functional transparency and zero-fluff telemetry over decorative ornamentation, the aesthetic blends the rigors of technical CAD schematics with modern web workstation utilities. 

Visual characteristics draw from **Clean Technical Minimalism** and **System Precision**:
- **Canvas-first composition**: Clean white backdrop overlaid with dual-weight orthographic blueprint grids, conveying mathematical reliability.
- **Instrumental density**: Compact interactive surfaces, fine-line iconography, and information-dense telemetry panels maximizing active viewport area.
- **Semantic chromatic tagging**: Strict functional role coloring that instantly segregates infrastructure categories (routing, switching, perimeters, end-nodes) without visual clash.

## Colors
The color system operates on an engineering schema where color serves as operational state and hardware taxonomy rather than mere styling.

### Canvas & Surface Hierarchy
- **Canvas Base**: `#FFFFFF` pure white working grid.
- **Minor Gridline**: `#E8EDF4` (10px sub-divisions).
- **Major Gridline**: `#CBD5E1` (50px structural snap coordinates).
- **Workstation Panel Surface**: `#F8FAFC` for docking bays, headers, and inspector tool trays.
- **Panel Surface Floating/Elevated**: `#FFFFFF` for modal diagnostic sheets, context menus, and active inspector cards.
- **Structural Dividers & Outlines**: `#DCE3EC` for 1px hairline panel separators and node collision bounding boxes.

### Functional Infrastructure Roles
- **Switch Blue (`#2563EB`)**: Layer 2 distribution devices, VLAN indicators, active ethernet trunk lines.
- **Router Orange (`#EA580C`)**: Layer 3 gateways, edge routers, WAN simulation metrics.
- **End-Device Green (`#16A34A`)**: Host PCs, VoIP terminals, printers, status nominal / link-up indicators.
- **Firewall Brick (`#DC2626`)**: Perimeter appliances, ACL block nodes, packet drop monitors, link-down/error alerts.
- **Server Purple (`#7C3AED`)**: Datacenter nodes, DHCP/DNS/RADIUS endpoints, hypervisors.
- **Connection Dark Slate (`#334155`)**: Copper/Fiber serial links, link labels, structural interface text.

## Typography
Typography is separated into two functional domains:
1. **Interface Management (Inter)**: Renders application labels, docked menu trees, system alerts, and global modal navigation with high legibility at micro scales.
2. **Technical Telemetry & Infrastructure Labels (JetBrains Mono)**: Applied universally to IP addresses (`IPv4/IPv6`), MAC addresses, CIDR masks, interface names (e.g., `Gig0/0/1`, `Fa0/24`), throughput readouts, and integrated terminal emulation lines. Monospaced tabular alignment ensures columnar sanity across dense routing tables.

## Layout & Spacing
The layout leverages a **Docked Multi-Pane Workstation Architecture** designed for high display productivity:
- **Canvas Viewport**: Infinite or fixed orthographic schematic surface occupying the primary viewport center.
- **Top Utility & Execution Bar**: Fixed height 40px housing simulation controls (Play, Pause, Step-by-Step, Clock speed).
- **Docked Side Panels**: Collapsible 280px left rack (Hardware Palette: Routers, Switches, Media) and 320px right rack (Packet Inspector, CLI console, Properties tree).
- **Bottom Telemetry Dock**: Collapsible 160px tray for live packet capture (PDU lists) and link state event logs.

### Rhythm & Density
The spacing tokens prioritize compact information layouts over negative space. Structural elements align strictly to a 4px layout rhythm. Internal tool components use `space-sm` (4px) and `space-md` (8px) gaps to minimize cursor traversal across dense parameter fields.

## Elevation & Depth
Depth is expressed through **Crisp Orthographic Layering** and **Hairline Precision** rather than diffused artistic shadows:
- **Level 0 (Infinite Canvas)**: Flat `#FFFFFF` plane patterned with `#E8EDF4` and `#CBD5E1` SVG or canvas-rendered grid lines.
- **Level 1 (Docked Workstation Panels)**: `#F8FAFC` flat surface delineated by a continuous 1px solid `#DCE3EC` border. Zero drop-shadow.
- **Level 2 (In-Canvas Topology Nodes)**: Hardware node tiles sit atop the grid with a `#FFFFFF` fill, 1px `#DCE3EC` border, and an ultra-subtle positioning shadow: `0 1px 2px rgba(51, 65, 85, 0.06)`.
- **Level 3 (Context Flyouts & Snapping Tooltips)**: `#FFFFFF` panels featuring a structured edge: 1px `#DCE3EC` border and directional containment shadow: `0 4px 12px rgba(51, 65, 85, 0.08)`.
- **Level 4 (CLI Terminals & Diagnostic Sheets)**: Modal dialogs floating at `z-index: 1000` with `0 12px 32px rgba(15, 23, 42, 0.12)`, bounded by 1px `#CBD5E1`.

## Shapes
To preserve the technical instruments and blueprint atmosphere, shape curvature is disciplined and minimal:
- **Containers, Docks, Canvas Nodes, and Windows**: `0.25rem` (4px). Clean, precise corners that evoke industrial equipment and hardware racks.
- **Buttons, Field Inputs, Badges, Tabs**: `0.25rem` (4px). Standardized across all interactive control clusters.
- **Cable Endpoints, Port Connection Plugs, Status LED Dots**: Perfectly circular (`rounded-full`) to denote functional terminal interfaces and mechanical junctions.

## Components

### Topology Canvas Nodes
- Rectangular composite modules (`64x64px` or `72x80px`) featuring a `#FFFFFF` base, 1px `#DCE3EC` outline, and a top category stripe (2px) matching the role color (e.g., `#EA580C` for routers).
- Centered hardware glyph rendered in role-accented fill/stroke.
- Sub-node labels use `JetBrains Mono` at `10px` (`#334155`), auto-wrapping below with subtle `#F8FAFC` background pills for contrast against gridlines.
- Dynamic interface pins: 6px circular terminal nodes at perimeter borders that highlight with `#2563EB` upon cable drag interactions.

### Buttons & Instrument Toolbars
- **Standard Button**: 28px height, 1px solid `#DCE3EC`, background `#FFFFFF`, text `#334155`, font size 12px font weight 500. Hover: background `#F8FAFC`, border `#CBD5E1`. Active: background `#E2E8F0`.
- **Primary / Simulation Action Button**: 28px height, solid `#2563EB` background, `#FFFFFF` text, zero border. Hover: `#1D4ED8`.
- **Tool Toggle (Select, Inspect, Cable, Delete)**: 32x32px icon button. Selected state: `#EFF6FF` background, 1px solid `#2563EB`, stroke icon `#2563EB`.

### Cable & Link Visualizer
- **FastEthernet / Gigabit (Copper)**: 2px solid `#334155` vector path.
- **Serial (WAN)**: 2px zigzag step link in `#EA580C`.
- **Fiber**: 2px dashed `#2563EB` link.
- **Link State Indicator**: 6px dual-state circular indicator situated near connection terminal: `#16A34A` (Link Up), `#DC2626` (Down / Protocol Mismatch), `#F59E0B` (STP Blocking).

### Input Fields & Property Editors
- Height: 26px for tight technical inspector forms.
- Background: `#FFFFFF`, 1px solid `#DCE3EC`, font family `JetBrains Mono` 11px, text color `#0F172A`. Focus state: 1px solid `#2563EB` with `0 0 0 2px rgba(37, 99, 235, 0.15)`.

### Chips, Pills & Interface Tags
- 18px compact badges for VLAN IDs and Port assignments.
- Text: 10px `JetBrains Mono` medium. Border: 1px solid matching the parent hardware category tone at 20% opacity, background matching role color at 8% opacity.

### Embedded Terminal & Console Panes
- Background: `#0F172A` (deep technical slate contrast) with `#F8FAFC` monospace code display.
- Cursor: 8x14px blinking green `#22C55E` or amber block.
- Header bar: `#1E293B` featuring discrete window controls and active node identifier (e.g., `Router-West# config t`).