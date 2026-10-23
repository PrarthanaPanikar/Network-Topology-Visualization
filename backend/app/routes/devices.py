"""Device management endpoints."""
from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models import Device, DeviceUpdate
from ..graph import get_graph

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.get("", response_model=List[Device])
async def list_devices():
    """Get all devices."""
    return get_graph().get_all_devices()


@router.post("", response_model=Device, status_code=status.HTTP_201_CREATED)
async def create_device(device: Device):
    """Create a new device."""
    if not get_graph().add_device(device):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device with this ID already exists"
        )
    return device


@router.get("/{device_id}", response_model=Device)
async def get_device(device_id: str):
    """Get a device by ID."""
    device = get_graph().get_device(device_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device


@router.put("/{device_id}", response_model=Device)
async def update_device(device_id: str, updates: DeviceUpdate):
    """Update a device."""
    device = get_graph().update_device(device_id, updates.model_dump(exclude_unset=True))
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(device_id: str):
    """Delete a device and its connections."""
    if not get_graph().remove_device(device_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )


@router.post("/{device_id}/duplicate", response_model=Device, status_code=status.HTTP_201_CREATED)
async def duplicate_device(device_id: str):
    """Duplicate a device with a new ID."""
    original = get_graph().get_device(device_id)
    if not original:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    # Create new device with modified ID and name
    new_id = f"{device_id}-copy"
    new_name = f"{original.name}-copy"
    
    new_device = Device(
        id=new_id,
        name=new_name,
        device_type=original.device_type,
        position={"x": original.position.get("x", 0) + 50, 
                  "y": original.position.get("y", 0) + 50},
        ip_address=original.ip_address,
        mac_address=original.mac_address
    )
    
    if not get_graph().add_device(new_device):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not duplicate device"
        )
    
    return new_device


@router.get("/{device_id}/neighbors", response_model=List[str])
async def get_neighbors(device_id: str):
    """Get connected neighbors of a device."""
    if not get_graph().get_device(device_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return get_graph().get_neighbors(device_id)
