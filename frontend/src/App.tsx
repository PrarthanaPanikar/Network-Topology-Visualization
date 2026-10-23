import { useEffect } from 'react'
import Toolbar from './components/Toolbar'
import DevicePalette from './components/DevicePalette'
import TopologyCanvas from './components/TopologyCanvas'
import PropertiesPanel from './components/PropertiesPanel'
import StatusBar from './components/StatusBar'
import { useTopologyStore } from './store/useTopologyStore'
import { getTopology, loadDemoTopology } from './api/client'

export default function App() {
  const initializeTopology = useTopologyStore((state) => state.initializeTopology)

  useEffect(() => {
    // On mount: fetch whatever the backend currently has (saved topology or demo).
    // We use GET /api/topology which returns the in-memory graph loaded at startup —
    // that will be the saved topology if a save file exists, or the demo if not.
    // We do NOT call load-demo here because that would unconditionally overwrite the
    // restored saved state with the hardcoded demo.
    getTopology()
      .then((response: any) => {
        const topology = response.data
        if (topology && topology.devices && Array.isArray(topology.devices) && topology.devices.length > 0) {
          initializeTopology(topology.devices, topology.connections ?? [])
        } else {
          // Backend returned empty topology — load demo as a one-time fallback
          return loadDemoTopology().then((demoResp: any) => {
            const demo = demoResp.data
            if (demo && demo.devices) {
              initializeTopology(demo.devices, demo.connections ?? [])
            } else {
              initializeTopology([], [])
            }
          })
        }
      })
      .catch((error) => {
        console.warn('Could not load topology from backend:', error)
        initializeTopology([], [])
      })
  }, [initializeTopology])

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-container-lowest">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Device Palette */}
        <DevicePalette />

        {/* Center Canvas */}
        <TopologyCanvas />

        {/* Right Properties Panel */}
        <PropertiesPanel />
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
  )
}
