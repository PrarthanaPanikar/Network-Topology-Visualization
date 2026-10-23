import { useTopologyStore } from '../store/useTopologyStore'

export default function StatusBar() {
  const devices = useTopologyStore((state) => state.devices)
  const connections = useTopologyStore((state) => state.connections)
  const zoom = useTopologyStore((state) => state.zoom)
  const selectedNodeId = useTopologyStore((state) => state.selectedNodeId)

  const selectedDevice = selectedNodeId ? devices.find((d) => d.id === selectedNodeId) : null

  return (
    <footer className="h-10 bg-surface-container-low border-t border-surface-container-high px-4 flex items-center justify-between z-40 select-none shadow-sm">
      <div className="font-code-sm text-[11px] text-on-surface-variant flex items-center gap-3">
        <span>Devices: {devices.length}</span>
        <span>|</span>
        <span>Connections: {connections.length}</span>
        {selectedDevice && (
          <>
            <span>|</span>
            <span>Selected: {selectedDevice.name}</span>
          </>
        )}
      </div>

      <div className="font-code-sm text-[11px] text-on-surface-variant">
        Zoom: {zoom}%
      </div>
    </footer>
  )
}
