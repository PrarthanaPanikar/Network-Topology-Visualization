import React from 'react'
import DeviceIcon from './DeviceIcon'

const PALETTE_DEVICES = [
  { label: 'Router', category: 'Routers', type: 'router' },
  { label: 'Switch', category: 'Switches', type: 'switch' },
  { label: 'Desktop PC', category: 'End Devices', type: 'desktop' },
  { label: 'Laptop', category: 'End Devices', type: 'laptop' },
  { label: 'Server', category: 'End Devices', type: 'server' },
]

export default function DevicePalette() {
  const handleDragStart = (e: React.DragEvent, deviceType: string) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('deviceType', deviceType)
  }

  return (
    <aside className="w-[175px] shrink-0 bg-surface-container-lowest border-r border-surface-container-high flex flex-col z-20 select-none shadow-xs">
      <div className="h-8 px-3 border-b border-surface-container-high bg-surface-container-low flex items-center justify-between">
        <span className="font-label-md text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-primary">devices</span>
          Devices
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2.5">
        {PALETTE_DEVICES.map((device, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => handleDragStart(e, device.type)}
            className="p-2 rounded hover:bg-surface-container-high flex items-center gap-2.5 cursor-grab active:cursor-grabbing transition-colors bg-surface-container-low group"
          >
            <div className="flex-shrink-0">
              <DeviceIcon type={device.type} size={24} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-code-sm text-[11px] font-semibold text-on-surface truncate">
                {device.label}
              </span>
              <span className="text-[9px] text-outline truncate">{device.category}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
