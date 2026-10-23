"""FastAPI main application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import devices, connections, topology, import_export
from app.graph import get_graph
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize app
app = FastAPI(
    title="Network Topology API",
    description="REST API for network topology management",
    version="1.0.0"
)

# CORS middleware for frontend
# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://network-topology-visualization.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(devices.router)
app.include_router(connections.router)
app.include_router(topology.router)
app.include_router(import_export.router)


# On startup: try to restore saved topology; fall back to demo only if no save exists
from pathlib import Path
from app.routes.topology import SAVE_FILE, _get_demo_topology

_graph = get_graph()
_loaded = False

try:
    _loaded = _graph.load_from_file(SAVE_FILE)
    if _loaded:
        logger.info(
            f"Restored saved topology: {len(_graph.devices)} devices, "
            f"{len(_graph.connections)} connections"
        )
except ValueError as exc:
    logger.error(f"Saved topology file is corrupt, falling back to demo: {exc}")
    _graph.clear()

if not _loaded:
    demo = _get_demo_topology()
    for device in demo.devices:
        _graph.add_device(device)
    for connection in demo.connections:
        _graph.add_connection(connection)
    logger.info(
        f"Demo topology loaded: {len(_graph.devices)} devices, "
        f"{len(_graph.connections)} connections"
    )


@app.get("/health")
async def health():
    """Health check endpoint."""
    graph = get_graph()
    return {
        "status": "ok",
        "devices": len(graph.devices),
        "connections": len(graph.connections)
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Network Topology Editor API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
