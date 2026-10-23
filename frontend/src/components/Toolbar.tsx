import { useState, useRef } from 'react'
import { useTopologyStore } from '../store/useTopologyStore'
import { saveTopology, importJSON } from '../api/client'
import AddDeviceDialog from './AddDeviceDialog'

export default function Toolbar() {
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const importFileInputRef = useRef<HTMLInputElement>(null)

  const tool = useTopologyStore((state) => state.tool)
  const setTool = useTopologyStore((state) => state.setTool)
  const zoom = useTopologyStore((state) => state.zoom)
  const undo = useTopologyStore((state) => state.undo)
  const redo = useTopologyStore((state) => state.redo)
  const devices = useTopologyStore((state) => state.devices)
  const connections = useTopologyStore((state) => state.connections)
  const initializeTopology = useTopologyStore((state) => state.initializeTopology)

  // ReactFlow viewport controls via trigger counters (canvas listens and calls RF methods)
  const triggerFitView = useTopologyStore((state) => state.triggerFitView)
  const triggerZoomIn = useTopologyStore((state) => state.triggerZoomIn)
  const triggerZoomOut = useTopologyStore((state) => state.triggerZoomOut)

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSave = async () => {
    try {
      await saveTopology({ devices, connections })
      showMessage('Topology saved successfully')
    } catch (error: any) {
      console.error('Failed to save topology:', error)
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Unknown error'
      showMessage(`Save failed: ${detail}`, 'error')
    }
  }

  const handleImportClick = () => {
    importFileInputRef.current?.click()
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      showMessage('Please select a valid JSON file', 'error')
      return
    }

    try {
      const topology = await importJSON(file)
      if (topology.data && topology.data.devices && topology.data.connections) {
        initializeTopology(topology.data.devices, topology.data.connections)
        showMessage('Topology imported successfully')
      } else {
        showMessage('Invalid topology file format', 'error')
      }
    } catch (error) {
      console.error('Failed to import topology:', error)
      showMessage('Failed to import topology file', 'error')
    }

    if (importFileInputRef.current) {
      importFileInputRef.current.value = ''
    }
  }

  return (
    <header className="h-12 bg-surface-container-lowest border-b border-surface-container-high px-4 flex items-center justify-between z-40 select-none shadow-sm">
      {/* Left: Brandmark & Tools */}
      <div className="flex items-center gap-3">
        {/* Logo & Version */}
        <div className="flex items-center gap-2 pr-3 border-r border-surface-container-high">
          <span className="font-headline-sm text-[15px] font-bold text-on-surface tracking-tight">
            NetTopology
          </span>
          <span className="font-code-sm text-[10px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-medium">
            v1.0
          </span>
        </div>

        {/* Primary Canvas Tools */}
        <div className="flex items-center gap-0.5 bg-surface-container-low p-0.5 rounded">
          <button
            onClick={() => setTool('select')}
            className={`h-7 px-2.5 flex items-center gap-1.5 rounded font-body-sm text-[12px] font-medium transition-all ${
              tool === 'select'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
            title="Select & Move (V)"
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>Select</span>
          </button>

          <button
            onClick={() => setIsAddDeviceDialogOpen(true)}
            className={`h-7 px-2 flex items-center gap-1 rounded font-body-sm text-[12px] transition-all ${
              tool === 'add'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
            title="Add Device (+)"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Device</span>
          </button>

          <button
            onClick={() => setTool('connect')}
            className={`h-7 px-2 flex items-center gap-1 rounded font-body-sm text-[12px] transition-all ${
              tool === 'connect'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
            title="Connect / Link (L)"
          >
            <span className="material-symbols-outlined text-[16px]">timeline</span>
            <span>Connect</span>
          </button>

          <button
            onClick={() => setTool('delete')}
            className={`h-7 px-2 flex items-center gap-1 rounded font-body-sm text-[12px] transition-all ${
              tool === 'delete'
                ? 'bg-error-container text-error shadow-sm'
                : 'text-on-surface-variant hover:text-error hover:bg-error-container'
            }`}
            title="Delete (Del)"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>

        {/* History Undo/Redo */}
        <div className="flex items-center gap-0.5 pl-2 border-l border-surface-container-high">
          <button
            onClick={undo}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <span className="material-symbols-outlined text-[16px]">undo</span>
          </button>

          <button
            onClick={redo}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <span className="material-symbols-outlined text-[16px]">redo</span>
          </button>
        </div>

        {/* View & Canvas Controls - wired to ReactFlow via triggers */}
        <div className="flex items-center gap-1 pl-2 border-l border-surface-container-high">
          <button
            onClick={triggerZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>

          <span className="font-code-sm text-[11px] text-on-surface px-1.5 font-medium min-w-[36px] text-center">
            {zoom}%
          </span>

          <button
            onClick={triggerZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>

          <button
            onClick={triggerFitView}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors ml-0.5"
            title="Fit to Screen"
          >
            <span className="material-symbols-outlined text-[16px]">fit_screen</span>
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Message Display */}
        {message && (
          <div
            className={`px-3 py-1.5 rounded text-[12px] font-body-sm ${
              message.type === 'success'
                ? 'bg-success-container text-success'
                : 'bg-error-container text-error'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSave}
          className="h-7 px-3 bg-primary text-on-primary hover:bg-primary-container rounded font-body-sm text-[12px] font-medium flex items-center gap-1 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[15px]">save</span>
          <span>Save</span>
        </button>

        {/* Import Button */}
        <button
          onClick={handleImportClick}
          className="h-7 px-3 bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded font-body-sm text-[12px] font-medium flex items-center gap-1 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[15px]">file_upload</span>
          <span>Import</span>
        </button>
        <input
          ref={importFileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>

      {/* Add Device Dialog */}
      <AddDeviceDialog
        isOpen={isAddDeviceDialogOpen}
        onClose={() => setIsAddDeviceDialogOpen(false)}
      />
    </header>
  )
}