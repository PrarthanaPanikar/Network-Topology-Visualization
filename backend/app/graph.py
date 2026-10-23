"""NetworkX graph operations for network topology."""
import json
import networkx as nx
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from .models import Device, Connection


class NetworkGraph:
    """Manages the network topology graph using NetworkX."""
    
    def __init__(self):
        self.graph = nx.Graph()
        self.devices: Dict[str, Device] = {}
        self.connections: Dict[str, Connection] = {}
    
    def add_device(self, device: Device) -> bool:
        """Add a device to the graph."""
        if device.id in self.devices:
            return False
        self.devices[device.id] = device
        self.graph.add_node(device.id, **device.model_dump())
        return True
    
    def remove_device(self, device_id: str) -> bool:
        """Remove a device and its connections."""
        if device_id not in self.devices:
            return False
        
        # Remove all connections involving this device
        to_remove = [conn_id for conn_id, conn in self.connections.items()
                     if conn.source == device_id or conn.target == device_id]
        for conn_id in to_remove:
            self.remove_connection(conn_id)
        
        # Remove from graph
        self.graph.remove_node(device_id)
        del self.devices[device_id]
        return True
    
    def update_device(self, device_id: str, updates: Dict) -> Optional[Device]:
        """Update device properties."""
        if device_id not in self.devices:
            return None
        
        device = self.devices[device_id]
        for key, value in updates.items():
            if hasattr(device, key) and value is not None:
                setattr(device, key, value)
        
        self.graph.nodes[device_id].update(device.model_dump())
        return device
    
    def get_device(self, device_id: str) -> Optional[Device]:
        """Get a device by ID."""
        return self.devices.get(device_id)
    
    def get_all_devices(self) -> List[Device]:
        """Get all devices."""
        return list(self.devices.values())
    
    def add_connection(self, connection: Connection) -> bool:
        """Add a connection between two devices."""
        # Validate devices exist
        if connection.source not in self.devices or connection.target not in self.devices:
            return False
        
        # Prevent self-connections
        if connection.source == connection.target:
            return False
        
        # Check for duplicate connections
        for conn in self.connections.values():
            if ((conn.source == connection.source and conn.target == connection.target) or
                (conn.source == connection.target and conn.target == connection.source)):
                return False
        
        self.connections[connection.id] = connection
        self.graph.add_edge(connection.source, connection.target, 
                           connection_id=connection.id, **connection.model_dump())
        return True
    
    def remove_connection(self, connection_id: str) -> bool:
        """Remove a connection."""
        if connection_id not in self.connections:
            return False
        
        conn = self.connections[connection_id]
        self.graph.remove_edge(conn.source, conn.target)
        del self.connections[connection_id]
        return True
    
    def get_connection(self, connection_id: str) -> Optional[Connection]:
        """Get a connection by ID."""
        return self.connections.get(connection_id)
    
    def get_all_connections(self) -> List[Connection]:
        """Get all connections."""
        return list(self.connections.values())
    
    def get_neighbors(self, device_id: str) -> List[str]:
        """Get connected neighbors of a device."""
        if device_id not in self.graph:
            return []
        return list(self.graph.neighbors(device_id))
    
    def get_connected_components(self) -> List[List[str]]:
        """Get list of connected components (isolated networks)."""
        return [list(component) for component in nx.connected_components(self.graph)]
    
    def validate_connection(self, source_id: str, target_id: str) -> Tuple[bool, str]:
        """Validate if a connection can be created."""
        if source_id not in self.devices:
            return False, "Source device does not exist"
        if target_id not in self.devices:
            return False, "Target device does not exist"
        if source_id == target_id:
            return False, "Cannot create self-connection"
        
        # Check for duplicate
        for conn in self.connections.values():
            if ((conn.source == source_id and conn.target == target_id) or
                (conn.source == target_id and conn.target == source_id)):
                return False, "Connection already exists"
        
        return True, "Valid"
    
    def clear(self):
        """Clear all devices and connections."""
        self.graph.clear()
        self.devices.clear()
        self.connections.clear()

    def save_to_file(self, path: Path) -> None:
        """Write current topology to a JSON file atomically."""
        # Build serialisable dict
        data = {
            "devices": [d.model_dump() for d in self.devices.values()],
            "connections": [c.model_dump() for c in self.connections.values()],
        }
        # Atomic write: write to .tmp then rename so a crash never corrupts the file
        tmp = path.with_suffix(".tmp")
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp.write_text(json.dumps(data, indent=2), encoding="utf-8")
        tmp.replace(path)

    def load_from_file(self, path: Path) -> bool:
        """
        Load topology from a JSON file.
        Returns True on success, False if the file does not exist.
        Raises ValueError if the file exists but is invalid/corrupt.
        Validates that every connection references an existing device.
        """
        if not path.exists():
            return False

        raw = path.read_text(encoding="utf-8")
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Saved topology file is not valid JSON: {exc}") from exc

        if not isinstance(data, dict):
            raise ValueError("Saved topology file has unexpected structure (root must be an object)")

        raw_devices = data.get("devices", [])
        raw_connections = data.get("connections", [])

        if not isinstance(raw_devices, list) or not isinstance(raw_connections, list):
            raise ValueError("Saved topology file: 'devices' and 'connections' must be arrays")

        # Parse models (raises ValidationError on bad fields)
        from .models import Device, Connection  # local import to avoid circular
        devices = [Device(**d) for d in raw_devices]
        connections = [Connection(**c) for c in raw_connections]

        # Validate referential integrity before touching graph state
        device_ids = {d.id for d in devices}
        for conn in connections:
            if conn.source not in device_ids:
                raise ValueError(f"Connection '{conn.id}' references unknown source '{conn.source}'")
            if conn.target not in device_ids:
                raise ValueError(f"Connection '{conn.id}' references unknown target '{conn.target}'")

        # All valid — replace graph state
        self.clear()
        for device in devices:
            self.add_device(device)
        for conn in connections:
            self.add_connection(conn)

        return True


# Global graph instance
_graph = NetworkGraph()


def get_graph() -> NetworkGraph:
    """Get the global graph instance."""
    return _graph
