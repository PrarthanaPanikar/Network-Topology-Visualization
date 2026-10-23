interface DeviceIconProps {
  type: string
  size?: number
}

export const RouterIcon = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="8" width="28" height="16" rx="2" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1"/>
    <circle cx="8" cy="14" r="2" fill="#60A5FA"/>
    <circle cx="16" cy="14" r="2" fill="#60A5FA"/>
    <circle cx="24" cy="14" r="2" fill="#60A5FA"/>
    <circle cx="8" cy="20" r="2" fill="#60A5FA"/>
    <circle cx="16" cy="20" r="2" fill="#60A5FA"/>
    <circle cx="24" cy="20" r="2" fill="#60A5FA"/>
    <circle cx="6" cy="6" r="1.5" fill="#10B981"/>
    <circle cx="10" cy="6" r="1.5" fill="#10B981"/>
  </svg>
)

export const SwitchIcon = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="6" width="30" height="20" rx="2" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1"/>
    <circle cx="5" cy="12" r="1.5" fill="#C4B5FD"/>
    <circle cx="5" cy="16" r="1.5" fill="#C4B5FD"/>
    <circle cx="5" cy="20" r="1.5" fill="#C4B5FD"/>
    <circle cx="9" cy="12" r="1.5" fill="#C4B5FD"/>
    <circle cx="9" cy="16" r="1.5" fill="#C4B5FD"/>
    <circle cx="9" cy="20" r="1.5" fill="#C4B5FD"/>
    <circle cx="13" cy="12" r="1.5" fill="#C4B5FD"/>
    <circle cx="13" cy="16" r="1.5" fill="#C4B5FD"/>
    <circle cx="13" cy="20" r="1.5" fill="#C4B5FD"/>
    <circle cx="17" cy="12" r="1.5" fill="#C4B5FD"/>
    <circle cx="17" cy="16" r="1.5" fill="#C4B5FD"/>
    <circle cx="17" cy="20" r="1.5" fill="#C4B5FD"/>
    <circle cx="21" cy="12" r="1.5" fill="#C4B5FD"/>
    <circle cx="21" cy="16" r="1.5" fill="#C4B5FD"/>
    <circle cx="21" cy="20" r="1.5" fill="#C4B5FD"/>
    <circle cx="25" cy="12" r="1.5" fill="#C4B5FD"/>
    <circle cx="25" cy="16" r="1.5" fill="#C4B5FD"/>
    <circle cx="25" cy="20" r="1.5" fill="#C4B5FD"/>
  </svg>
)

export const DesktopIcon = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="16" rx="1" fill="#EF4444" stroke="#991B1B" strokeWidth="1"/>
    <rect x="6" y="6" width="20" height="12" fill="#FECACA"/>
    <rect x="10" y="21" width="12" height="2" fill="#991B1B"/>
    <circle cx="16" cy="22" r="1" fill="#991B1B"/>
  </svg>
)

export const LaptopIcon = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="28" height="16" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="1"/>
    <rect x="4" y="6" width="24" height="12" fill="#FCD34D"/>
    <path d="M 6 22 L 26 22 L 24 26 L 8 26 Z" fill="#B45309"/>
  </svg>
)

export const ServerIcon = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="28" height="7" rx="1" fill="#10B981" stroke="#047857" strokeWidth="1"/>
    <rect x="4" y="8" width="4" height="3" fill="#6EE7B7"/>
    <rect x="10" y="8" width="4" height="3" fill="#6EE7B7"/>
    <rect x="16" y="8" width="4" height="3" fill="#6EE7B7"/>
    <rect x="22" y="8" width="4" height="3" fill="#6EE7B7"/>
    <rect x="2" y="16" width="28" height="7" rx="1" fill="#10B981" stroke="#047857" strokeWidth="1"/>
    <rect x="4" y="18" width="4" height="3" fill="#6EE7B7"/>
    <rect x="10" y="18" width="4" height="3" fill="#6EE7B7"/>
    <rect x="16" y="18" width="4" height="3" fill="#6EE7B7"/>
    <rect x="22" y="18" width="4" height="3" fill="#6EE7B7"/>
  </svg>
)

export const PrinterIcon = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="24" height="4" fill="#EC4899" stroke="#BE185D" strokeWidth="1"/>
    <rect x="2" y="10" width="28" height="14" rx="1" fill="#F472B6" stroke="#BE185D" strokeWidth="1"/>
    <rect x="4" y="13" width="24" height="8" fill="#FDE2E4"/>
    <rect x="6" y="22" width="20" height="2" fill="#EC4899"/>
  </svg>
)

export default function DeviceIcon({ type, size = 32 }: DeviceIconProps) {
  // Normalise: lowercase, replace underscores with spaces, trim
  const t = (type ?? '').toLowerCase().replace(/_/g, ' ').trim()
  switch (t) {
    case 'router':
      return <RouterIcon size={size} />
    case 'switch':
      return <SwitchIcon size={size} />
    case 'pc':
    case 'desktop':
    case 'desktop pc':
    case 'end device':
      return <DesktopIcon size={size} />
    case 'laptop':
      return <LaptopIcon size={size} />
    case 'server':
      return <ServerIcon size={size} />
    case 'printer':
      return <PrinterIcon size={size} />
    default:
      return <RouterIcon size={size} />
  }
}
