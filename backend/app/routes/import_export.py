"""Import/Export functionality."""
from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
import json
import csv
import io
from typing import List
from ..models import Topology, Device, Connection
from ..graph import get_graph
from datetime import datetime

router = APIRouter(prefix="/api", tags=["import-export"])


@router.get("/export/json")
async def export_json():
    """Export topology as JSON."""
    graph = get_graph()
    topology = Topology(
        devices=graph.get_all_devices(),
        connections=graph.get_all_connections(),
        metadata={"exported_at": datetime.now().isoformat()}
    )
    
    json_content = topology.model_dump_json(indent=2)
    
    # Return as file download
    return FileResponse(
        filename="topology.json",
        content=json_content,
        media_type="application/json"
    )


@router.post("/import/json")
async def import_json(file: UploadFile = File(...)):
    """Import topology from JSON file."""
    try:
        contents = await file.read()
        data = json.loads(contents)
        topology = Topology(**data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON: {str(e)}"
        )
    
    # Try to load topology without destroying current state on failure
    graph = get_graph()
    original_devices = graph.get_all_devices()
    original_connections = graph.get_all_connections()
    
    try:
        graph.clear()
        for device in topology.devices:
            if not graph.add_device(device):
                raise ValueError(f"Failed to add device: {device.id}")
        for connection in topology.connections:
            if not graph.add_connection(connection):
                raise ValueError(f"Failed to add connection: {connection.id}")
    except Exception as e:
        # Restore original state on failure
        graph.clear()
        for device in original_devices:
            graph.add_device(device)
        for connection in original_connections:
            graph.add_connection(connection)
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Import failed: {str(e)}"
        )
    
    return {"status": "success", "message": "Topology imported"}


@router.get("/export/csv/devices")
async def export_devices_csv():
    """Export devices as CSV."""
    graph = get_graph()
    devices = graph.get_all_devices()
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "name", "device_type", "x", "y", "ip_address", "mac_address"])
    writer.writeheader()
    
    for device in devices:
        x = device.position.get("x", 0) if device.position else 0
        y = device.position.get("y", 0) if device.position else 0
        writer.writerow({
            "id": device.id,
            "name": device.name,
            "device_type": device.device_type,
            "x": x,
            "y": y,
            "ip_address": device.ip_address or "",
            "mac_address": device.mac_address or ""
        })
    
    return FileResponse(
        filename="devices.csv",
        content=output.getvalue(),
        media_type="text/csv"
    )


@router.get("/export/csv/connections")
async def export_connections_csv():
    """Export connections as CSV."""
    graph = get_graph()
    connections = graph.get_all_connections()
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "source", "target", "speed", "status"])
    writer.writeheader()
    
    for conn in connections:
        writer.writerow({
            "id": conn.id,
            "source": conn.source,
            "target": conn.target,
            "speed": conn.speed,
            "status": conn.status
        })
    
    return FileResponse(
        filename="connections.csv",
        content=output.getvalue(),
        media_type="text/csv"
    )
