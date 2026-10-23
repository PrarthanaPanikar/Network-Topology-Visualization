import { useState, useEffect } from 'react'
import { useTopologyStore } from '../store/useTopologyStore'

export default function PropertiesPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const selectedNodeId = useTopologyStore((state) => state.selectedNodeId)
  const selectedEdgeId = useTopologyStore((state) => state.selectedEdgeId)
  const devices = useTopologyStore((state) => state.devices)
  const connections = useTopologyStore((state) => state.connections)
  const updateDevice = useTopologyStore((state) => state.updateDevice)

  const [editingName, setEditingName] = useState('')
  const [editingIP, setEditingIP] = useState('')
  const [editingMAC, setEditingMAC] = useState('')

  const selectedDevice = selectedNodeId ? devices.find((d) => d.id === selectedNodeId) : null
  const selectedConnection = selectedEdgeId ? connections.find((c) => c.id === selectedEdgeId) : null

  useEffect(() => {
    if (selectedDevice) {
      setEditingName(selectedDevice.name)
      setEditingIP(selectedDevice.ip_address || '')
      setEditingMAC(selectedDevice.mac_address || '')
    }
  }, [selectedDevice])

  const handleSaveName = () => {
    if (selectedDevice && editingName.trim()) {
      updateDevice(selectedDevice.id, { name: editingName })
    }
  }

  const handleSaveIP = () => {
    if (selectedDevice) {
      updateDevice(selectedDevice.id, { ip_address: editingIP })
    }
  }

  const handleSaveMAC = () => {
    if (selectedDevice) {
      updateDevice(selectedDevice.id, { mac_address: editingMAC })
    }
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="w-8 h-full bg-surface-container-low border-l border-surface-container-high flex items-center justify-center hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
          chevron_left
        </span>
      </button>
    )
  }

  return (
    <aside className="w-80 bg-surface-container-lowest border-l border-surface-container-high flex flex-col z-20 select-none shadow-xs">
      <div className="h-8 px-3 border-b border-surface-container-high bg-surface-container-low flex items-center justify-between">
        <span className="font-label-md text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Properties
        </span>
        <button
          onClick={() => setIsCollapsed(true)}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
            chevron_right
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selectedDevice ? (
          <div className="space-y-3">
            <div>
              <label className="text-label-sm text-on-surface-variant">Device Name</label>
              <div className="flex gap-1 mt-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="flex-1 px-2 py-1.5 bg-white border border-surface-container-high rounded text-body-sm text-on-surface"
                  placeholder="Device name"
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1.5 bg-primary text-on-primary rounded text-[11px] hover:bg-primary-container transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">Device Type</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded capitalize">
                {selectedDevice.device_type}
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">Position</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded font-mono text-code-sm">
                X: {selectedDevice.position.x.toFixed(0)}, Y: {selectedDevice.position.y.toFixed(0)}
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">IP Address</label>
              <div className="flex gap-1 mt-1">
                <input
                  type="text"
                  value={editingIP}
                  onChange={(e) => setEditingIP(e.target.value)}
                  onBlur={handleSaveIP}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveIP()}
                  className="flex-1 px-2 py-1.5 bg-white border border-surface-container-high rounded text-body-sm text-on-surface"
                  placeholder="e.g., 192.168.1.1"
                />
                <button
                  onClick={handleSaveIP}
                  className="px-2 py-1.5 bg-primary text-on-primary rounded text-[11px] hover:bg-primary-container transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">MAC Address</label>
              <div className="flex gap-1 mt-1">
                <input
                  type="text"
                  value={editingMAC}
                  onChange={(e) => setEditingMAC(e.target.value)}
                  onBlur={handleSaveMAC}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveMAC()}
                  className="flex-1 px-2 py-1.5 bg-white border border-surface-container-high rounded text-body-sm text-on-surface"
                  placeholder="e.g., 00:1A:2B:3C:4D:5E"
                />
                <button
                  onClick={handleSaveMAC}
                  className="px-2 py-1.5 bg-primary text-on-primary rounded text-[11px] hover:bg-primary-container transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : selectedConnection ? (
          <div className="space-y-3">
            <div>
              <label className="text-label-sm text-on-surface-variant">Connection ID</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded font-mono text-code-sm break-all">
                {selectedConnection.id}
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">Source</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded">
                {devices.find((d) => d.id === selectedConnection.source)?.name || selectedConnection.source}
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">Target</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded">
                {devices.find((d) => d.id === selectedConnection.target)?.name || selectedConnection.target}
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">Speed</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded capitalize">
                {selectedConnection.speed}
              </div>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant">Status</label>
              <div className="text-body-sm text-on-surface mt-1 px-2 py-1.5 bg-surface-container rounded capitalize">
                {selectedConnection.status}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-on-surface-variant text-body-sm py-8">
            No device or connection selected
          </div>
        )}
      </div>
    </aside>
  )
}
