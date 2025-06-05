# Desktop App Packaging Guide for Cal

This guide outlines how to package Cal as a desktop application using either Tauri (recommended) or Electron.

## Option 1: Tauri (Recommended)

Tauri is lighter, faster, and more secure than Electron. It uses the system's native webview and Rust for the backend.

### Benefits:
- **Small bundle size**: ~10MB vs Electron's ~150MB
- **Better performance**: Native system webview
- **More secure**: Rust backend with fine-grained permissions
- **Lower memory usage**: ~50MB vs Electron's ~200MB+

### Implementation Steps:

1. **Install Tauri CLI**:
   ```bash
   npm install --save-dev @tauri-apps/cli
   ```

2. **Initialize Tauri**:
   ```bash
   cd frontend
   npm run tauri init
   ```

3. **Configure `tauri.conf.json`**:
   ```json
   {
     "build": {
       "beforeBuildCommand": "npm run build",
       "beforeDevCommand": "npm run dev",
       "devPath": "http://localhost:3000",
       "distDir": "../dist"
     },
     "tauri": {
       "bundle": {
         "identifier": "com.cal.nutrition",
         "icon": ["icons/icon.ico", "icons/icon.png"]
       },
       "windows": [
         {
           "title": "Cal - Nutrition Tracker",
           "width": 1200,
           "height": 800
         }
       ]
     }
   }
   ```

4. **Embed the Python Backend**:
   - Bundle Python runtime with PyInstaller
   - Start backend process from Tauri on app launch
   - Communicate via localhost API

5. **Build the app**:
   ```bash
   npm run tauri build
   ```

## Option 2: Electron

Electron is more mature with a larger ecosystem but creates bigger apps.

### Implementation Steps:

1. **Install Electron**:
   ```bash
   npm install --save-dev electron electron-builder
   ```

2. **Create `electron/main.js`**:
   ```javascript
   const { app, BrowserWindow } = require('electron')
   const { spawn } = require('child_process')
   const path = require('path')
   
   let mainWindow
   let backendProcess
   
   function createWindow() {
     mainWindow = new BrowserWindow({
       width: 1200,
       height: 800,
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true
       }
     })
     
     mainWindow.loadURL('http://localhost:3000')
   }
   
   app.whenReady().then(() => {
     // Start Python backend
     backendProcess = spawn('python', [
       path.join(__dirname, '../cal-backend/main.py')
     ])
     
     createWindow()
   })
   
   app.on('window-all-closed', () => {
     if (backendProcess) backendProcess.kill()
     app.quit()
   })
   ```

3. **Update `package.json`**:
   ```json
   {
     "main": "electron/main.js",
     "scripts": {
       "electron": "electron .",
       "dist": "electron-builder"
     },
     "build": {
       "appId": "com.cal.nutrition",
       "productName": "Cal",
       "directories": {
         "output": "dist"
       },
       "files": [
         "dist/**/*",
         "electron/**/*",
         "../cal-backend/**/*"
       ]
     }
   }
   ```

## Packaging Python Backend

For both options, you'll need to bundle the Python backend:

1. **Install PyInstaller**:
   ```bash
   pip install pyinstaller
   ```

2. **Create build script**:
   ```bash
   pyinstaller --onefile \
     --add-data "prompt_template.txt:." \
     --add-data "prompt_schema.json:." \
     --hidden-import "uvicorn.logging" \
     --hidden-import "uvicorn.loops" \
     --hidden-import "uvicorn.loops.auto" \
     --hidden-import "uvicorn.protocols" \
     --hidden-import "uvicorn.protocols.http" \
     --hidden-import "uvicorn.protocols.http.auto" \
     --hidden-import "uvicorn.protocols.websockets" \
     --hidden-import "uvicorn.protocols.websockets.auto" \
     --hidden-import "uvicorn.lifespan" \
     --hidden-import "uvicorn.lifespan.on" \
     cal-backend/main.py
   ```

## Environment Variables

For production builds, handle the API key securely:

1. **Option 1**: Prompt user on first launch
2. **Option 2**: Use system keychain (via `keytar` for Electron or Tauri's secure storage)
3. **Option 3**: Store encrypted in app data directory

## Auto-Updates

Both platforms support auto-updates:

- **Tauri**: Built-in updater with code signing
- **Electron**: Use `electron-updater` with releases on GitHub

## Distribution

1. **macOS**: Sign and notarize the app for distribution
2. **Windows**: Sign with a code certificate
3. **Linux**: Create AppImage, .deb, or .rpm packages

## Recommended Next Steps

1. Start with Tauri for a lighter, more modern approach
2. Create app icons (1024x1024 PNG)
3. Set up GitHub Actions for automated builds
4. Implement secure API key storage
5. Add auto-update functionality