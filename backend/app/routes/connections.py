"""Connection management endpoints."""
from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models import Connection, ConnectionRequest
from ..graph import get_graph
import uuid

router = APIRouter(prefix="/api/connections", tags=["connections"])


@router.get("", response_model=List[Connection])
async def list_connections():
    """Get all connections."""
    return get_graph().get_all_connections()


@router.post("", response_model=Connection, status_code=status.HTTP_201_CREATED)
async def create_connection(req: ConnectionRequest):
    """Create a new connection."""
    # Validate connection
    valid, message = get_graph().validate_connection(req.source, req.target)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    connection = Connection(
        id=f"edge-{uuid.uuid4().hex[:8]}",
        source=req.source,
        target=req.target,
        speed=req.speed,
        status="up"
    )
    
    if not get_graph().add_connection(connection):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create connection"
        )
    
    return connection


@router.get("/{connection_id}", response_model=Connection)
async def get_connection(connection_id: str):
    """Get a connection by ID."""
    connection = get_graph().get_connection(connection_id)
    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )
    return connection


@router.delete("/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connection(connection_id: str):
    """Delete a connection."""
    if not get_graph().remove_connection(connection_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )
