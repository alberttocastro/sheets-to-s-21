// Main electron file
// This file is responsible for creating the main window and loading the index.html file
// It also handles the application lifecycle events

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Import electron
const electron = require('electron');
// Import the app module
const app = electron.app;
// Import the BrowserWindow module
const BrowserWindow = electron.BrowserWindow;
// Import the path module
const path = require("path");
// Import the url module
const url = require("url");

// Create a global reference to the window object
let mainWindow;

// Create a function to create the main window
function createWindow() {
    // Create the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    });

    // Load the index.html file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the devtools
    mainWindow.webContents.openDevTools();

    // Handle the window being closed
    mainWindow.on('closed', function() {
        // Dereference the window object
        mainWindow = null;
    });
}

// Create a function to handle the application being ready
app.on('ready', createWindow);

// Create a function to handle the application being activated
app.on('activate', function() {
    // Check if the main window is null
    if (mainWindow === null) {
        // Create the main window
        createWindow();
    }
});

// Create a function to handle the application being closed
app.on('window-all-closed', function() {
    // Check if the platform is not macOS
    if (process.platform !== 'darwin') {
        // Quit the application
        app.quit();
    }
});
