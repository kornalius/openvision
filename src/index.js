'use strict'

var electron = require('electron')
var { app } = electron
var { BrowserWindow } = electron
var client = require('electron-connect').client

var windowStateKeeper = require('./window-state')
var path = require('path')

// require('electron-debug')() // eslint-disable-line global-require
// var path = require('path') // eslint-disable-line
// var p = path.join(__dirname, '..', 'app', 'node_modules') // eslint-disable-line
// require('module').globalPaths.push(p) // eslint-disable-line

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow
var mainWindowState


// Electron specific

// var installDevtron = () => { require('devtron').install() }

// var installExtension = require('electron-devtools-installer').default

// var installPixiDevTool = () => {
  // installExtension('aamddddknhcagpehecnhphigffljadon')
    // .then(name => console.log(`Added Extension:  ${name}`))
    // .catch(err => console.log('An error occurred: ', err))
// }

// var installWebGLDevTool = () => {
  // installExtension('ogkcjmbhnfmlnielkjhedpcjomeaghda')
    // .then(name => console.log(`Added Extension:  ${name}`))
    // .catch(err => console.log('An error occurred: ', err))
// }

// var isElectronDevMode = () => {
  // return process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)
// }


var createWindow = () => {
  mainWindowState = windowStateKeeper('main', { width: 1000, height: 600 })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,

    width: mainWindowState.width,
    height: mainWindowState.height,

    webPreferences: {
      webSecurity: false,
      plugins: true,
      textAreasAreResizable: false,
      experimentalFeatures: true,
      experimentalCanvasFeatures: true,
      // subpixelFontScaling: true,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      sharedWorker: true,
    }
  })

  if (mainWindowState.isMaximized) {
    mainWindow.maximize()
  }

  // and load the index.html of the app.
  mainWindow.loadURL(path.join('file://', __dirname, '../index.html'))

  client.create(mainWindow)

  // add development tools
  // installDevtron()
  // installPixiDevTool()

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
