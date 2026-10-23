import { create } from 'zustand'
import { deleteDevice as deleteDeviceApi, deleteConnection as deleteConnectionApi } from '../api/client'

export interface Device {
  id: string
  name: string
  device_type: string
  position: { x: number; y: number }
  ip_address?: string
  mac_address?: string
}

export interface Connection {
  id: string
  source: string
  target: string
  speed: string
  status: string
}

export interface HistoryState {
  devices: Device[]
  connections: Connection[]
}

interface TopologyStore {
  devices: Device[]
  connections: Connection[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  tool: 'select' | 'add' | 'connect' | 'delete'
  connectingFrom: string | null
  zoom: number
  history: HistoryState[]
  historyIndex: number

  // Trigger counters for RF viewport control (incremented to fire)
  fitViewTrigger: number
  zoomInTrigger: number
  zoomOutTrigger: number

  // Actions
  addDevice: (device: Device) => void
  updateDevice: (id: string, updates: Partial<Device>) => void
  updateDevicePosition: (id: string, pos: { x: number; y: number }) => void
  deleteDevice: (id: string) => void
  addConnection: (connection: Connection) => void
  deleteConnection: (id: string) => void
  selectNode: (id: string | null) => void
  selectEdge: (id: string | null) => void
  setTool: (tool: string) => void
  setConnectingFrom: (id: string | null) => void
  setZoom: (zoom: number) => void
  triggerFitView: () => void
  triggerZoomIn: () => void
  triggerZoomOut: () => void
  undo: () => void
  redo: () => void
  initializeTopology: (devices: Device[], connections: Connection[]) => void
  saveToHistory: () => void
  getConnectedDevices: (deviceId: string) => string[]
}

export const useTopologyStore = create<TopologyStore>((set, get) => ({
  devices: [],
  connections: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  tool: 'select',
  connectingFrom: null,
  zoom: 100,
  history: [],
  historyIndex: -1,
  fitViewTrigger: 0,
  zoomInTrigger: 0,
  zoomOutTrigger: 0,

  addDevice: (device) => {
    set((state) => ({ devices: [...state.devices, device] }))
    get().saveToHistory()
  },

  updateDevice: (id, updates) => {
    set((state) => ({
      devices: state.devices.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }))
    get().saveToHistory()
  },

  // Position-only update — does NOT call saveToHistory (used during drag ticks)
  updateDevicePosition: (id, pos) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, position: pos } : d
      ),
    }))
  },

  deleteDevice: (id) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
      connections: state.connections.filter((c) => c.source !== id && c.target !== id),
    }))
    get().saveToHistory()
    deleteDeviceApi(id).catch((err) => console.error('[API] deleteDevice failed:', err))
  },

  addConnection: (connection) => {
    set((state) => ({ connections: [...state.connections, connection] }))
    get().saveToHistory()
  },

  deleteConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    }))
    get().saveToHistory()
    deleteConnectionApi(id).catch((err) => console.error('[API] deleteConnection failed:', err))
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  setTool: (tool) => set({ tool: tool as any, connectingFrom: null }),
  setConnectingFrom: (id) => set({ connectingFrom: id }),

  setZoom: (zoom) => set({ zoom }),

  triggerFitView: () => set((s) => ({ fitViewTrigger: s.fitViewTrigger + 1 })),
  triggerZoomIn: () => set((s) => ({ zoomInTrigger: s.zoomInTrigger + 1 })),
  triggerZoomOut: () => set((s) => ({ zoomOutTrigger: s.zoomOutTrigger + 1 })),

  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      const h = state.history[newIndex]
      set({ devices: h.devices, connections: h.connections, historyIndex: newIndex })
    }
  },

  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      const h = state.history[newIndex]
      set({ devices: h.devices, connections: h.connections, historyIndex: newIndex })
    }
  },

  initializeTopology: (devices, connections) => {
    set({
      devices,
      connections,
      history: [
        {
          devices: JSON.parse(JSON.stringify(devices)),
          connections: JSON.parse(JSON.stringify(connections)),
        },
      ],
      historyIndex: 0,
      selectedNodeId: null,
      selectedEdgeId: null,
      connectingFrom: null,
    })
  },

  saveToHistory: () => {
    const state = get()
    const snap = {
      devices: JSON.parse(JSON.stringify(state.devices)),
      connections: JSON.parse(JSON.stringify(state.connections)),
    }
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(snap)
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  getConnectedDevices: (deviceId) => {
    const state = get()
    return state.connections
      .filter((c) => c.source === deviceId || c.target === deviceId)
      .map((c) => (c.source === deviceId ? c.target : c.source))
  },
}))
