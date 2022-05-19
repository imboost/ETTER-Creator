const debug = "DEV" || process.env.debug || "DEV";

// import { app, BrowserWindow } from 'electron';
const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem } = require('electron');
const fs = require('fs');
var path = require('path');

// var flowfile = "flows.json";
// var userdir = ".";

// if (!fs.existsSync(path.resolve(path.join(userdir, flowfile)))) {
//   fs.readFile(path.resolve(path.join(__dirname, flowfile)), "utf8", (err, data) => {
//     if (err) {
//       console.log(err)
//       throw err
//     } else {
//       let file_content = data.toString('utf8');
//       fs.writeFileSync(path.resolve(path.join(userdir, flowfile)), file_content);
//     }
//   });
// }

// Socket Port
let socketPort = Math.floor(1000 + Math.random() * 9000);

const nodered = require("./server.js");
nodered(socketPort);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var menu_option = [{
  label: 'Menu',
  submenu: [
    {
      label: 'UI Designer',
      click() {
        mainWindow.loadURL("http://127.0.0.1:" + listenPort + url);
      }
    },
    {
      label: 'Node-RED',
      click() {
        mainWindow.loadURL("http://127.0.0.1:" + listenPort + urledit);
      }
    },
    {
      label: 'ETTER Cloud',
      click() {
        mainWindow.loadURL("https://console.etter.cloud");
      }
    },
    { type: 'separator' },
    {
      role: 'quit'
    }
  ]
}, {
  label: "Edit",
  submenu: [
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]
}, {
  label: 'View',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload();
      }
    },
    {
      label: 'Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
      }
    },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' },
    { role: 'minimize' }
  ]
}];

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Set Menu
  // mainWindow.setMenu(menu_option);
  const menu = Menu.buildFromTemplate(menu_option);
  Menu.setApplicationMenu(menu);

  // load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (debug == "DEV") mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

ipcMain.on('getSocketPort', (event, args) => {
  event.returnValue = socketPort;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
