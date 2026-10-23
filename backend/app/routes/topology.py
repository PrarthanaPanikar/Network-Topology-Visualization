"""Topology state and management endpoints."""
from fastapi import APIRouter, HTTPException, status
from pathlib import Path
from typing import List
from ..models import Topology, Device, Connection
from ..graph import get_graph
from datetime import datetime
import json

router = APIRouter(prefix="/api/topology", tags=["topology"])

# Path to the persisted topology file — resolved relative to this source file so
# it is always backend/data/topology.json regardless of the working directory.
# __file__ = backend/app/routes/topology.py  →  .parent = routes/  →  .parent = app/
#   →  .parent = backend/  →  / "data" / "topology.json"
SAVE_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "topology.json"


def _get_demo_topology() -> Topology:
    """Create the demo topology with R1, S1, S2, PC1, PC2, PC3."""
    devices = [
        Device(id="node-r1", name="R1", device_type="router", 
               position={"x": 520, "y": 80}, ip_address="192.168.1.1"),
        Device(id="node-s1", name="S1", device_type="switch", 
               position={"x": 310, "y": 250}, ip_address="192.168.1.2"),
        Device(id="node-s2", name="S2", device_type="switch", 
               position={"x": 730, "y": 250}, ip_address="192.168.1.3"),
        Device(id="node-pc1", name="PC1", device_type="pc", 
               position={"x": 180, "y": 480}),
        Device(id="node-pc2", name="PC2", device_type="pc", 
               position={"x": 380, "y": 480}),
        Device(id="node-pc3", name="PC3", device_type="pc", 
               position={"x": 630, "y": 480}),
    ]
    
    connections = [
        Connection(id="edge-1", source="node-r1", target="node-s1", speed="gigabit", status="up"),
        Connection(id="edge-2", source="node-r1", target="node-s2", speed="gigabit", status="up"),
        Connection(id="edge-3", source="node-s1", target="node-pc1", speed="gigabit", status="up"),
        Connection(id="edge-4", source="node-s1", target="node-pc2", speed="gigabit", status="up"),
        Connection(id="edge-5", source="node-s2", target="node-pc3", speed="gigabit", status="up"),
    ]
    
    return Topology(
        name="Demo Network",
        devices=devices,
        connections=connections,
        metadata={"created_at": datetime.now().isoformat(), "version": "1.0"}
    )


@router.get("", response_model=Topology)
async def get_topology():
    """Get the current topology state."""
    graph = get_graph()
    return Topology(
        devices=graph.get_all_devices(),
        connections=graph.get_all_connections(),
        metadata={"device_count": len(graph.devices), "connection_count": len(graph.connections)}
    )


@router.post("/load")
async def load_topology(topology: Topology):
    """Load a topology (replace current in-memory state). Used by import — does NOT write to disk."""
    graph = get_graph()
    graph.clear()
    
    # Add devices
    for device in topology.devices:
        if not graph.add_device(device):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add device: {device.id}"
            )
    
    # Add connections
    for connection in topology.connections:
        if not graph.add_connection(connection):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add connection: {connection.id}"
            )
    
    return {"status": "success", "message": "Topology loaded"}


@router.post("/save")
async def save_topology(topology: Topology):
    """
    Save topology to disk.
    Replaces the in-memory graph with the received topology, then persists it to
    SAVE_FILE so the state survives server restarts.
    """
    graph = get_graph()
    graph.clear()

    for device in topology.devices:
        if not graph.add_device(device):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add device: {device.id}"
            )

    for connection in topology.connections:
        if not graph.add_connection(connection):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add connection: {connection.id}"
            )

    try:
        graph.save_to_file(SAVE_FILE)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to write topology to disk: {exc}"
        )

    return {"status": "success", "message": "Topology saved", "path": str(SAVE_FILE)}


@router.post("/reset")
async def reset_topology():
    """Reset to demo topology and remove any persisted save file."""
    # Delete the save file so the demo loads cleanly on next restart
    if SAVE_FILE.exists():
        SAVE_FILE.unlink()

    demo = _get_demo_topology()
    await load_topology(demo)
    return {"status": "success", "message": "Topology reset to demo"}


@router.post("/load-demo")
async def load_demo():
    """Load the initial demo topology."""
    demo = _get_demo_topology()
    graph = get_graph()
    graph.clear()
    
    for device in demo.devices:
        graph.add_device(device)
    
    for connection in demo.connections:
        graph.add_connection(connection)
    
    return demo
