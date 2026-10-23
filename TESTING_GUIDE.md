# Network Topology Editor - Complete Testing Guide

## Pre-Test Setup
- ✅ Backend: Running on `http://localhost:8000`
- ✅ Frontend: Running on `http://localhost:5173` (Vite dev server)
- ✅ Demo topology: Auto-loads on startup (R1, S1, S2, PC1, PC2, PC3)

---

## Test Suite 1: Add Device Dialog

### Test 1.1: Open Dialog
**Steps:**
1. Look for "+ Device" button in toolbar (next to Select button)
2. Click "+ Device" button
3. Observe modal appears with title "Add New Device"

**Expected Result:**
- Modal overlay covers background
- Title shows "Add New Device"
- Two input fields visible: Device Name and Device Type
- Device Type shows "Router" as default
- Cancel and "Add Device" buttons visible
- Device Name field has focus (cursor visible)

---

### Test 1.2: Validation - Empty Name
**Steps:**
1. Open Add Device dialog
2. Leave Device Name empty
3. Click "Add Device" button

**Expected Result:**
- Error message appears: "Device name is required"
- Dialog stays open
- No device created
- No network request sent

---

### Test 1.3: Validation - Duplicate Name
**Steps:**
1. Open Add Device dialog
2. Type "R1" (existing device name)
3. Click "Add Device" button

**Expected Result:**
- Error message appears: "A device with this name already exists"
- Dialog stays open
- No device created
- No network request sent

---

### Test 1.4: Successful Creation - Router
**Steps:**
1. Open Add Device dialog
2. Type "Router-Main"
3. Confirm Device Type is "Router"
4. Click "Add Device" button

**Expected Result:**
- Dialog closes immediately
- New device appears on canvas with label "Router-Main"
- Device count in status bar increments
- Device is selectable and editable

---

### Test 1.5: Successful Creation - Multiple Types
**Steps:**
1. Create device type "Switch": name = "Switch-Lab"
2. Create device type "End Device": name = "PC-Office"
3. Observe both appear on canvas

**Expected Result:**
- Three different device types visible on canvas
- Status bar shows correct count
- All devices have correct icons/display

---

## Test Suite 2: Drag-and-Drop Devices

### Test 2.1: Drag from Palette
**Steps:**
1. Locate Device Palette on left side
2. Hover over "Router" item
3. Cursor should change to "grab" hand

**Expected Result:**
- Cursor changes on hover
- Item highlights with hover background color

---

### Test 2.2: Drop on Canvas
**Steps:**
1. Drag "Router" from palette to center of canvas
2. Release mouse

**Expected Result:**
- New router device appears at drop location
- Auto-named with format: Router-{counter}
- Increments counter (Router-1, Router-2, etc.)
- Appears immediately, no loading delay
- Device count increments

---

### Test 2.3: Drop Multiple Devices
**Steps:**
1. Drag 2 Routers, 2 Switches, 1 Laptop from palette
2. Drop in different locations on canvas

**Expected Result:**
- All 5 devices appear on canvas
- Each has correct icon and name
- Status bar shows "Devices: X"
- All are individually selectable

---

### Test 2.4: Drop Position Accuracy
**Steps:**
1. Drag "Switch" to top-left of canvas (near coordinates ~100, 100)
2. Release
3. Click on device to see properties

**Expected Result:**
- Device appears near drop position
- Properties panel shows position coordinates
- Coordinates approximate drop location (within ~50-100px)

---

## Test Suite 3: Connection Management

### Test 3.1: Connect Two Devices
**Steps:**
1. Click "Connect" button in toolbar
2. On canvas: hover near handle on Device A
3. Drag line to Device B
4. Release on Device B's handle

**Expected Result:**
- Animated connection line appears
- Connection shows in canvas
- Status bar shows incremented connection count
- Connection is selectable (click to highlight)

---

### Test 3.2: View Connection Properties
**Steps:**
1. Create connection between two devices
2. Click on connection line to select it
3. Look at Properties panel on right

**Expected Result:**
- Connection ID shown
- Source device name shown
- Target device name shown
- Speed: "gigabit"
- Status: "active"

---

## Test Suite 4: Save & Persist

### Test 4.1: Save to Backend
**Steps:**
1. Create or modify topology (add device, make connection)
2. Click "Save" button in toolbar
3. Wait for response

**Expected Result:**
- Success message shows: "Topology saved successfully"
- Message auto-dismisses after 3 seconds
- No page reload needed
- Backend receives complete topology state

---

### Test 4.2: Save Error Handling
**Steps:**
1. (Requires stopping backend or network failure simulation)
2. Try to save topology
3. Observe error response

**Expected Result:**
- Error message shows: "Failed to save topology"
- Message appears for 3 seconds
- Application remains functional
- Can still make edits

---

## Test Suite 5: Undo/Redo

### Test 5.1: Undo Single Action
**Steps:**
1. Create device "Test-Device"
2. Observe device appears and count increments
3. Click Undo button (left arrow)

**Expected Result:**
- Device disappears
- Count decrements
- Canvas returns to previous state

---

### Test 5.2: Redo After Undo
**Steps:**
1. Create device, then undo
2. Click Redo button (right arrow)

**Expected Result:**
- Device reappears
- Count increments again
- Exact same state restored

---

### Test 5.3: Undo/Redo Chain
**Steps:**
1. Create 3 devices: A, B, C
2. Undo 3 times (back to start)
3. Redo 2 times

**Expected Result:**
- After 3 undos: All devices gone
- After 2 redos: Only A and B visible (C removed)
- Status bar shows correct count

---

## Test Suite 6: Delete Tool

### Test 6.1: Delete Single Device
**Steps:**
1. Click "Delete" button in toolbar (button turns red/error-colored)
2. Click on a device node

**Expected Result:**
- Device disappears
- All connections to that device also disappear
- Device count decrements
- Selection cleared

---

### Test 6.2: Delete Connection
**Steps:**
1. Click "Delete" button
2. Click on a connection line (edge)

**Expected Result:**
- Connection disappears
- Both devices remain
- Connection count decrements
- Can still connect them again with Connect tool

---

### Test 6.3: Undo Delete
**Steps:**
1. Create device, then delete it
2. Click Undo

**Expected Result:**
- Device reappears in same position
- All properties preserved
- Device count restored

---

## Test Suite 7: Zoom Controls

### Test 7.1: Zoom In
**Steps:**
1. Click "+" zoom button repeatedly (3-5 times)
2. Observe zoom percentage in toolbar

**Expected Result:**
- Canvas zooms in (elements appear larger)
- Zoom percentage increases: 100% → 110% → 120% etc.
- Maximum zoom: 200%
- Prevents zooming beyond 200%

---

### Test 7.2: Zoom Out
**Steps:**
1. Click "-" zoom button repeatedly
2. Observe zoom percentage

**Expected Result:**
- Canvas zooms out (elements appear smaller)
- Zoom percentage decreases
- Minimum zoom: 50%
- Prevents zooming below 50%

---

### Test 7.3: Reset Zoom
**Steps:**
1. Change zoom to 150%
2. Click reset zoom button (square icon)

**Expected Result:**
- Zoom returns to exactly 100%
- Canvas fits well in viewport

---

## Test Suite 8: Properties Panel

### Test 8.1: Select Device & View Properties
**Steps:**
1. Click on any device node
2. Look at Properties panel on right

**Expected Result:**
- Device Name field shows current name
- Device Type shows (Router, Switch, PC, etc.)
- Position shows X, Y coordinates
- IP Address field visible (empty or value)
- MAC Address field visible

---

### Test 8.2: Edit Device Name
**Steps:**
1. Select a device
2. Type new name in "Device Name" field
3. Click "Save" button next to field (or press Enter)

**Expected Result:**
- Device name on canvas updates immediately
- Properties panel updates
- Change is saved to store
- Can be undone with Undo button

---

### Test 8.3: Edit IP Address
**Steps:**
1. Select device
2. Type "192.168.1.100" in IP Address field
3. Click Save

**Expected Result:**
- IP stored in device
- Can be exported/imported
- Visible in CSV export

---

### Test 8.4: View Connection Properties
**Steps:**
1. Click on a connection line
2. Look at Properties panel

**Expected Result:**
- Connection ID shown
- Source device name shown
- Target device name shown
- Speed shown (gigabit)
- Status shown (active)

---

## Test Suite 9: Export Functionality

### Test 9.1: Export JSON
**Steps:**
1. Ensure topology has 3+ devices and 2+ connections
2. Click "Export" button
3. Select "Export as JSON"
4. Wait for download

**Expected Result:**
- Download starts automatically
- File named `topology-YYYY-MM-DD.json`
- Success message shows: "Topology exported as JSON"
- Message auto-dismisses

**File Verification:**
- Open downloaded JSON file
- Should contain:
  ```json
  {
    "name": "Untitled Topology",
    "devices": [...],
    "connections": [...],
    "metadata": {...}
  }
  ```
- All devices in JSON
- All connections in JSON
- Proper format (valid JSON)

---

### Test 9.2: Export CSV
**Steps:**
1. Click "Export" button
2. Select "Export as CSV"

**Expected Result:**
- Download starts
- File named `topology-devices-YYYY-MM-DD.csv`
- Success message shows

**File Verification:**
- Open CSV file in text editor or Excel
- Header row: Device Name,Device Type,Position X,Position Y,IP Address,MAC Address
- Each device in its own row
- All data properly quoted
- Numeric values for coordinates

---

## Test Suite 10: Import Functionality

### Test 10.1: Import Valid JSON
**Steps:**
1. Export current topology as JSON (save file)
2. Delete all devices (or use Reset)
3. Click "Import" button
4. Select the JSON file you saved
5. Wait for upload

**Expected Result:**
- File uploads
- Success message shows: "Topology imported successfully"
- All devices reappear on canvas
- All connections reappear
- Device count matches export
- Canvas shows full topology

---

### Test 10.2: Import with Non-JSON File
**Steps:**
1. Create a text file (file.txt)
2. Click "Import"
3. Try to select .txt file

**Expected Result:**
- File picker should filter to .json files only (may depend on browser)
- Or if selected: Error message shows "Please select a valid JSON file"
- No import occurs
- Current topology preserved

---

### Test 10.3: Import with Invalid JSON
**Steps:**
1. Create file `bad.json` with invalid JSON: `{invalid json content}`
2. Click "Import"
3. Select bad.json

**Expected Result:**
- Error message shows in toolbar
- Current topology is NOT modified (rollback)
- Can try importing valid file after

---

### Test 10.4: Import with Missing Required Fields
**Steps:**
1. Create JSON file with incomplete device data
2. Click "Import"
3. Select the file

**Expected Result:**
- Error message displays
- Original topology preserved
- User can fix file and try again

---

## Test Suite 11: Integration Tests

### Test 11.1: Complete Workflow - Create & Export
**Steps:**
1. Add 4 devices via dialog: "Router-1", "Switch-1", "PC1", "PC2"
2. Connect Router-1 to Switch-1
3. Connect Switch-1 to PC1
4. Connect Switch-1 to PC2
5. Edit PC1 name to "PC1-Office", set IP "192.168.1.10"
6. Edit PC2 name to "PC2-Lab", set IP "192.168.1.20"
7. Save
8. Export as JSON
9. Export as CSV

**Expected Result:**
- All 4 devices visible
- 3 connections animated
- Save shows success
- JSON export includes all devices and connections
- CSV export shows 4 device rows with correct data
- Both files have correct names and dates

---

### Test 11.2: Complete Workflow - Import & Verify
**Steps:**
1. From Test 11.1, save the exported JSON file
2. Delete all devices (or manually delete each one)
3. Verify canvas is empty, count shows 0
4. Import the JSON file
5. Verify topology restored

**Expected Result:**
- Canvas empty after deletion
- Import restores all 4 devices
- All 3 connections restored
- Device names and IP addresses match
- Properties panel shows correct data
- Status bar shows: "Devices: 4, Connections: 3"

---

### Test 11.3: Edit After Import
**Steps:**
1. Import topology (from Test 11.2)
2. Edit one device (change name or IP)
3. Add new device via dialog
4. Create new connection
5. Save

**Expected Result:**
- Edits apply immediately
- New device appears
- New connection shows
- Save completes without error
- Undo/Redo work correctly

---

## Test Suite 12: Edge Cases & Stress Tests

### Test 12.1: Create Many Devices
**Steps:**
1. Create 20+ devices via dialog or drag-drop
2. Observe performance

**Expected Result:**
- All devices appear on canvas
- No significant lag
- Device count accurate
- All selectable

---

### Test 12.2: Create Many Connections
**Steps:**
1. Have 10 devices
2. Create 15+ connections between various devices

**Expected Result:**
- All connections show (animated)
- No visible lag or crashes
- Connections count accurate
- Can still edit and delete

---

### Test 12.3: Undo/Redo Large History
**Steps:**
1. Create 30 devices
2. Make 50+ state changes
3. Undo back to start
4. Redo forward to end

**Expected Result:**
- All transitions smooth
- History preserves all states correctly
- No memory issues or crashes

---

## Test Suite 13: Error Scenarios

### Test 13.1: Network Failure - Save
**Steps:**
1. (Stop backend or disable network)
2. Make changes
3. Try to save

**Expected Result:**
- Error message shows
- Application still works
- Changes preserved in memory
- Can still undo/redo

---

### Test 13.2: Backend Returns Invalid Data
**Steps:**
1. (Simulated - would need backend modification)
2. Import malformed topology

**Expected Result:**
- Error handled gracefully
- Current state preserved
- No crashes

---

## Manual Verification Checklist

### Feature: Add Device Dialog
- [ ] Dialog opens on button click
- [ ] Form fields display correctly
- [ ] Device Type dropdown has 3 options
- [ ] Empty name validation works
- [ ] Duplicate name validation works
- [ ] Device created on submit
- [ ] Device appears on canvas
- [ ] Device persists to backend
- [ ] Dialog closes after successful add
- [ ] Error messages display on validation failures

### Feature: Drag-and-Drop
- [ ] Palette items draggable (cursor changes)
- [ ] Drop creates device at position
- [ ] Auto-naming works (Router-1, etc.)
- [ ] Device count increments
- [ ] Backend persistence works
- [ ] Multiple devices can be added via drag-drop
- [ ] All device types work (Router, Switch, End Device)

### Feature: Save/Persist
- [ ] Save button visible in toolbar
- [ ] Click shows success message
- [ ] Topology sent to backend
- [ ] Undo/Redo don't prevent save
- [ ] Error handling on network failure

### Feature: Export/Import
- [ ] Export button visible with dropdown menu
- [ ] JSON export creates valid file
- [ ] CSV export creates valid file
- [ ] File names include date
- [ ] Import button accepts .json files
- [ ] Import validates file format
- [ ] Import restores topology
- [ ] Import error handling works
- [ ] Topology preserved on import error

### Feature: Core UI
- [ ] Status bar shows device/connection counts
- [ ] Device names show on canvas
- [ ] Properties panel shows selected device
- [ ] Can edit device names and IP addresses
- [ ] Zoom controls work (in, out, reset)
- [ ] Undo/Redo buttons work
- [ ] Delete tool removes devices/connections
- [ ] Select tool allows clicking/selecting

---

## Browser Compatibility Testing

Test in:
- [ ] Chrome/Edge (Chromium-based)
- [ ] Firefox
- [ ] Safari (if available)

Expected: All features work in all browsers

---

## Performance Metrics

### Load Time
- [ ] Page loads in < 2 seconds
- [ ] Demo topology loads immediately

### Responsiveness
- [ ] UI responds immediately to clicks
- [ ] No lag when dragging devices
- [ ] Smooth zoom transitions
- [ ] Export/import complete in < 3 seconds

### Memory Usage
- [ ] Adding 50 devices doesn't cause lag
- [ ] 100+ history entries handled smoothly

---

## Success Criteria

✅ **All tests must pass for feature to be considered complete:**

1. Add Device Dialog: 10/10 tests passing
2. Drag-and-Drop: 4/4 tests passing
3. Export/Import: 6/6 tests passing
4. Undo/Redo: 3/3 tests passing
5. Delete: 3/3 tests passing
6. Zoom: 3/3 tests passing
7. Properties: 4/4 tests passing
8. Save: 2/2 tests passing
9. All integration tests passing
10. No console errors or warnings

---

## Notes for Testers

- Each test should be independent (can run in any order)
- If a test fails, note the exact steps and expected vs actual result
- Take screenshots of failures
- Test on multiple browsers if possible
- Check browser console for errors (F12 → Console tab)
- Backend must be running on http://localhost:8000
- Frontend must be running on http://localhost:5173

