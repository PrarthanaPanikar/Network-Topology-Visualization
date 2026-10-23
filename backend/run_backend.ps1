# Simple backend startup script - no venv needed
# Your global Python already has all dependencies

cd "c:\Users\My Dell\OneDrive\Desktop\Network-Topology-Visualization\backend"

Write-Host "Starting Network Topology Backend..." -ForegroundColor Cyan
Write-Host "Python version:" -ForegroundColor Green
python --version
Write-Host ""
Write-Host "Backend will run on: http://localhost:8000" -ForegroundColor Green
Write-Host "Swagger docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

python main.py
