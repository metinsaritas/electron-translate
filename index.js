const {app, BrowserWindow, globalShortcut, Tray, Menu} = require('electron')
const path = require('path')
const Options = require('./options')

let appIcon = null
function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 680,
    height: 70,
    webPreferences: {
      nodeIntegration: true,
    },
    vibrancy:  "ultra-dark",
    frame: false,
    resizable: false
  })

  mainWindow.center()
  
  mainWindow.loadFile('index.html')
  mainWindow.on('blur', () => {
    mainWindow.close()
  })

}

app.allowRendererProcessReuse = false

app.on('ready', () => {

  appIcon = new Tray(__dirname + '/img/translate-24.png')
  appIcon.setToolTip(`Translate shortcut active: ${Options.SHORTCUT_KEY}`)

  const contexMenu = Menu.buildFromTemplate([{ label: 'Quit', accelerator: 'Command+Q', selector: 'terminate:'  }])
  appIcon.setContextMenu(contexMenu)
  app.dock.hide()

  const ret = globalShortcut.register(Options.SHORTCUT_KEY, () => {
    if (BrowserWindow.getAllWindows().length >= 1) return
    
    createWindow()
  })

  if (!ret) {
    console.log('registration failed')
  }

  console.log(`isRegistered ${Options.SHORTCUT_KEY}: `, globalShortcut.isRegistered(Options.SHORTCUT_KEY))
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})