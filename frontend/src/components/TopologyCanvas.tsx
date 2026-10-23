import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Connection,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  NodeChange,
  EdgeChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useTopologyStore, Device } from '../store/useTopologyStore'
import { createDevice, createConnection as createConnectionApi } from '../api/client'
import DeviceIcon from './DeviceIcon'

// ── DeviceNode: pure display, no store subscription ──────────────────────────
// All interaction is handled at the parent level via onNodeClick
function DeviceNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 bg-white cursor-pointer transition-all ${
        selected
          ? 'border-primary shadow-lg ring-2 ring-primary ring-opacity-50'
          : 'border-surface-container-high hover:border-primary'
      }`}
      style={{ minWidth: 90 }}
    >
      <div className="flex flex-col items-center gap-1">
        <DeviceIcon type={data.device_type} size={32} />
        <p className="text-xs font-semibold text-on-surface text-center leading-tight">{data.label}</p>
        <p className="text-[9px] text-on-surface-variant capitalize">{data.device_type}</p>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#6366f1' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#6366f1' }} />
    </div>
  )
}

// ── Stable nodeTypes constant (OUTSIDE component to avoid node remounts) ─────
const nodeTypes = { deviceNode: DeviceNode as React.ComponentType<NodeProps> }

// ── Inner canvas — uses useReactFlow which requires a ReactFlowProvider ───────
function CanvasInner() {
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const initialFitDone = useRef(false)

  // Store selectors
  const devices = useTopologyStore((s) => s.devices)
  const connections = useTopologyStore((s) => s.connections)
  const selectedNodeId = useTopologyStore((s) => s.selectedNodeId)
  const selectedEdgeId = useTopologyStore((s) => s.selectedEdgeId)
  const tool = useTopologyStore((s) => s.tool)
  const connectingFrom = useTopologyStore((s) => s.connectingFrom)
  const fitViewTrigger = useTopologyStore((s) => s.fitViewTrigger)
  const zoomInTrigger = useTopologyStore((s) => s.zoomInTrigger)
  const zoomOutTrigger = useTopologyStore((s) => s.zoomOutTrigger)

  // Store actions
  const addConnection = useTopologyStore((s) => s.addConnection)
  const updateDevicePosition = useTopologyStore((s) => s.updateDevicePosition)
  const saveToHistory = useTopologyStore((s) => s.saveToHistory)
  const deleteDevice = useTopologyStore((s) => s.deleteDevice)
  const deleteConnection = useTopologyStore((s) => s.deleteConnection)
  const selectNode = useTopologyStore((s) => s.selectNode)
  const selectEdge = useTopologyStore((s) => s.selectEdge)
  const setConnectingFrom = useTopologyStore((s) => s.setConnectingFrom)
  const addDevice = useTopologyStore((s) => s.addDevice)
  const setZoom = useTopologyStore((s) => s.setZoom)

  // ── Derive stable nodes from Zustand (memoized) ────────────────────────────
  const nodes: Node[] = useMemo(
    () =>
      devices.map((device) => ({
        id: device.id,
        type: 'deviceNode',
        data: {
          label: device.name,
          device_type: device.device_type,
          id: device.id,
        },
        position: device.position,
        selected: selectedNodeId === device.id,
      })),
    [devices, selectedNodeId]
  )

  // ── Derive stable edges from Zustand (memoized) ────────────────────────────
  const edges: Edge[] = useMemo(
    () =>
      connections.map((conn) => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        selected: selectedEdgeId === conn.id,
        animated: conn.status === 'up' || conn.status === 'active',
        style: {
          stroke: selectedEdgeId === conn.id ? '#6366f1' : '#94a3b8',
          strokeWidth: selectedEdgeId === conn.id ? 2.5 : 1.5,
        },
        data: { speed: conn.speed, status: conn.status },
      })),
    [connections, selectedEdgeId]
  )

  // ── fitView once after first devices load ──────────────────────────────────
  useEffect(() => {
    if (devices.length > 0 && !initialFitDone.current) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 })
        initialFitDone.current = true
      }, 150)
    }
  }, [devices.length, fitView])

  // ── React to toolbar trigger counters ─────────────────────────────────────
  const prevFitRef = useRef(0)
  useEffect(() => {
    if (fitViewTrigger > 0 && fitViewTrigger !== prevFitRef.current) {
      prevFitRef.current = fitViewTrigger
      fitView({ padding: 0.2, duration: 300 })
    }
  }, [fitViewTrigger, fitView])

  const prevZoomInRef = useRef(0)
  useEffect(() => {
    if (zoomInTrigger > 0 && zoomInTrigger !== prevZoomInRef.current) {
      prevZoomInRef.current = zoomInTrigger
      zoomIn({ duration: 200 })
    }
  }, [zoomInTrigger, zoomIn])

  const prevZoomOutRef = useRef(0)
  useEffect(() => {
    if (zoomOutTrigger > 0 && zoomOutTrigger !== prevZoomOutRef.current) {
      prevZoomOutRef.current = zoomOutTrigger
      zoomOut({ duration: 200 })
    }
  }, [zoomOutTrigger, zoomOut])

  // ── Track viewport zoom for display in Toolbar ────────────────────────────
  const onMoveEnd = useCallback(
    (_event: unknown, viewport: { x: number; y: number; zoom: number }) => {
      setZoom(Math.round(viewport.zoom * 100))
    },
    [setZoom]
  )

  // ── onNodesChange: handle only selection signals, ignore position changes ──
  // Positions are written back only on drag-stop (onNodeDragStop), not every tick
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const c of changes) {
        if (c.type === 'select') {
          if (c.selected) selectNode(c.id)
          else selectNode(null)
        }
      }
    },
    [selectNode]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      for (const c of changes) {
        if (c.type === 'select') {
          if (c.selected) selectEdge(c.id)
          else selectEdge(null)
        }
      }
    },
    [selectEdge]
  )

  // ── Drag stop: write final position to store once ─────────────────────────
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      updateDevicePosition(node.id, node.position)
      saveToHistory()
    },
    [updateDevicePosition, saveToHistory]
  )

  // ── Node click ─────────────────────────────────────────────────────────────
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (tool === 'delete') {
        deleteDevice(node.id)
        selectNode(null)
        return
      }
      if (tool === 'connect') {
        if (!connectingFrom) {
          setConnectingFrom(node.id)
        } else if (connectingFrom === node.id) {
          // Clicked same node — cancel
          setConnectingFrom(null)
        } else {
          // Check for duplicate or self-connection
          const duplicate = connections.some(
            (c) =>
              (c.source === connectingFrom && c.target === node.id) ||
              (c.source === node.id && c.target === connectingFrom)
          )
          if (!duplicate) {
            const newConn = {
              id: `edge-${Date.now()}`,
              source: connectingFrom,
              target: node.id,
              speed: 'gigabit',
              status: 'active',
            }
            addConnection(newConn)
            createConnectionApi(connectingFrom, node.id, 'gigabit').catch(() => {})
          }
          setConnectingFrom(null)
        }
        return
      }
      selectNode(node.id)
    },
    [tool, connectingFrom, connections, deleteDevice, selectNode, addConnection, setConnectingFrom]
  )

  // ── Edge click ─────────────────────────────────────────────────────────────
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      if (tool === 'delete') {
        deleteConnection(edge.id)
        selectEdge(null)
      } else {
        selectEdge(edge.id)
      }
    },
    [tool, deleteConnection, selectEdge]
  )

  // ── Handle connection drag (always works, validated for duplicates/self) ───
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return
      if (connection.source === connection.target) return // no self-loop
      const duplicate = connections.some(
        (c) =>
          (c.source === connection.source && c.target === connection.target) ||
          (c.source === connection.target && c.target === connection.source)
      )
      if (duplicate) return
      const newConn = {
        id: `edge-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        speed: 'gigabit',
        status: 'active',
      }
      addConnection(newConn)
      createConnectionApi(connection.source, connection.target, 'gigabit').catch(() => {})
    },
    [connections, addConnection]
  )

  // ── Keyboard delete + Escape ───────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          deleteDevice(selectedNodeId)
          selectNode(null)
        } else if (selectedEdgeId) {
          deleteConnection(selectedEdgeId)
          selectEdge(null)
        }
      }
      if (e.key === 'Escape') {
        selectNode(null)
        selectEdge(null)
        setConnectingFrom(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, selectedEdgeId, deleteDevice, deleteConnection, selectNode, selectEdge, setConnectingFrom])

  // ── Drag-and-drop from DevicePalette ──────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    // dataTransfer.types are lowercase in some browsers
    const hasType =
      e.dataTransfer?.types?.includes('deviceType') ||
      e.dataTransfer?.types?.includes('devicetype')
    if (hasType) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const deviceType = e.dataTransfer.getData('deviceType')
      if (!deviceType) return
      const canvas = e.currentTarget
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Generate unique name
      const typePrefix = deviceType.charAt(0).toUpperCase() + deviceType.slice(1)
      let counter = 1
      while (devices.some((d) => d.name === `${typePrefix}-${counter}`)) counter++
      const name = `${typePrefix}-${counter}`

      const deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newDevice: Device = {
        id: deviceId,
        name,
        device_type: deviceType.toLowerCase(),
        position: { x, y },
        ip_address: '',
        mac_address: '',
      }
      addDevice(newDevice)
      try {
        await createDevice(newDevice)
      } catch {
        // offline / backend not running — local state still valid
      }
    },
    [devices, addDevice]
  )

  // ── Cursor style based on active tool ─────────────────────────────────────
  const cursorStyle =
    tool === 'delete' ? 'crosshair' :
    tool === 'connect' ? 'cell' :
    'default'

  return (
    <section
      className="flex-1 relative bg-surface-container-lowest overflow-hidden"
      style={{ cursor: cursorStyle }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Connect-mode banner */}
      {tool === 'connect' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs font-medium shadow-md pointer-events-none select-none">
          {connectingFrom
            ? 'Source set — click a second device to connect'
            : 'Connect mode — click a device to start a connection'}
        </div>
      )}

      {/* Delete-mode banner */}
      {tool === 'delete' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-error text-on-error rounded-full text-xs font-medium shadow-md pointer-events-none select-none">
          Delete mode — click a device or connection to remove it
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        // Disable RF's own delete keys — we handle deletion ourselves
        deleteKeyCode={null}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        panOnDrag={tool !== 'connect'}
        snapToGrid={false}
        minZoom={0.2}
        maxZoom={3}
      >
        <Background color="#94a3b8" gap={24} />
        <Controls showInteractive={false} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </section>
  )
}

// ── Exported wrapper with ReactFlowProvider ───────────────────────────────────
export default function TopologyCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}
