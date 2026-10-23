import { useState, useEffect } from 'react'
import { useTopologyStore, Device } from '../store/useTopologyStore'
import { createDevice } from '../api/client'

interface AddDeviceDialogProps {
  isOpen: boolean
  onClose: () => void
}

const DEVICE_TYPES = ['Router', 'Switch', 'End Device']

export default function AddDeviceDialog({ isOpen, onClose }: AddDeviceDialogProps) {
  const [name, setName] = useState('')
  const [deviceType, setDeviceType] = useState('Router')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const devices = useTopologyStore((state) => state.devices)
  const addDevice = useTopologyStore((state) => state.addDevice)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setDeviceType('Router')
      setError('')
    }
  }, [isOpen])

  const validateInput = (): string | null => {
    if (!name.trim()) {
      return 'Device name is required'
    }

    // Check for duplicate names
    if (devices.some((d) => d.name.toLowerCase() === name.trim().toLowerCase())) {
      return 'A device with this name already exists'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validateInput()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    try {
      // Generate a unique ID
      const deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create new device with random position on canvas
      const newDevice: Device = {
        id: deviceId,
        name: name.trim(),
        device_type: deviceType,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        ip_address: '',
        mac_address: '',
      }

      // Add to local store
      addDevice(newDevice)

      // Persist to backend
      try {
        await createDevice(newDevice)
      } catch (apiError) {
        console.warn('Failed to persist device to backend:', apiError)
        // Device is already in local store, so we continue
      }

      // Close dialog
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface-container-lowest rounded-lg shadow-lg w-96 border border-surface-container-high">
        {/* Header */}
        <div className="h-10 px-6 border-b border-surface-container-high bg-surface-container-low flex items-center justify-between">
          <span className="font-headline-sm text-[15px] font-bold text-on-surface">
            Add New Device
          </span>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Device Name Field */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-2">
              Device Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Router-1, Switch-Main"
              className="w-full px-3 py-2 border border-surface-container-high rounded bg-white text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Device Type Dropdown */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-2">
              Device Type
            </label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-3 py-2 border border-surface-container-high rounded bg-white text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isLoading}
            >
              {DEVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 bg-error-container rounded text-error text-body-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-surface-container-high">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded border border-surface-container-high text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 font-body-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50 font-body-sm font-medium flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="animate-spin">
                  <span className="material-symbols-outlined text-[16px]">
                    progress_activity
                  </span>
                </span>
              )}
              <span>{isLoading ? 'Adding...' : 'Add Device'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
