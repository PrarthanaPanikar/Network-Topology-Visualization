"""Pydantic data models for network topology."""
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class Device(BaseModel):
    """Represents a network device (router, switch, PC, etc.)."""
    id: str = Field(..., description="Unique device identifier")
    name: str = Field(..., description="Display name (e.g., R1, S1)")
    device_type: str = Field(..., description="Device type: router, switch, pc, laptop, server, printer")
    position: Dict[str, float] = Field(default_factory=dict, description="Canvas position {x, y}")
    ip_address: Optional[str] = Field(None, description="IP address")
    mac_address: Optional[str] = Field(None, description="MAC address")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "node-1",
                "name": "R1",
                "device_type": "router",
                "position": {"x": 100, "y": 50},
                "ip_address": "192.168.1.1",
                "mac_address": "aa:bb:cc:dd:ee:ff"
            }
        }


class Connection(BaseModel):
    """Represents a connection between two devices."""
    id: str = Field(..., description="Unique connection identifier")
    source: str = Field(..., description="Source device ID")
    target: str = Field(..., description="Target device ID")
    speed: str = Field(default="gigabit", description="Connection speed: gigabit, fastethernet")
    status: str = Field(default="up", description="Connection status: up, down")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "edge-1",
                "source": "node-1",
                "target": "node-2",
                "speed": "gigabit",
                "status": "up"
            }
        }


class Topology(BaseModel):
    """Complete network topology state."""
    name: str = Field(default="Untitled Topology", description="Topology name")
    devices: List[Device] = Field(default_factory=list, description="List of devices")
    connections: List[Connection] = Field(default_factory=list, description="List of connections")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Demo Network",
                "devices": [],
                "connections": [],
                "metadata": {"created_at": "2024-01-01", "version": "1.0"}
            }
        }


class DeviceUpdate(BaseModel):
    """Device update payload."""
    name: Optional[str] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    position: Optional[Dict[str, float]] = None


class ConnectionRequest(BaseModel):
    """Request to create a connection."""
    source: str = Field(..., description="Source device ID")
    target: str = Field(..., description="Target device ID")
    speed: str = Field(default="gigabit", description="Connection speed")
