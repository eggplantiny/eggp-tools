import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron'
import ProgressBar from 'electron-progressbar'
import { autoUpdater } from 'electron-updater'
import postcss from 'postcss'

import tailwindcss from 'tailwindcss'

import TurndownService from 'turndown'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    frame: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'About eggp-tools',
          click: () => {
            const version = app.getVersion()
            dialog.showMessageBox({
              type: 'info',
              title: 'About eggp-tools',
              message: `eggp-tools version ${version}\nBuilt with Electron and React`,
              buttons: ['OK'],
            })
          },
        },
        {
          label: 'Check for Update',
          click: () => {
            autoUpdater.checkForUpdates()
          },
        },
        { role: 'quit' },
      ],
    },
  ])
  Menu.setApplicationMenu(menu)

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app
  .whenReady()
  .then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('ping', () => console.log('pong'))

    ipcMain.handle('html-to-markdown', (_event, html: string) => {
      const turndownService = new TurndownService()
      const markdown = turndownService.turndown(html)
      return markdown
    })

    ipcMain.handle('tailwind-to-css', async (_event, classNames) => {
      try {
        const _classNames = Array.isArray(classNames) ? classNames.join(' ') : classNames

        const sourceHTML = `<div class="${_classNames}"></div>`

        const tailwindConfig = {
          corePlugins: {
            preflight: false,
          },
          content: [{ raw: sourceHTML, extension: 'html' }],
        }

        const result = await postcss([
          tailwindcss(tailwindConfig),
        ]).process('@tailwind base;\n@tailwind utilities;', { from: undefined })

        return result.css
      }
      catch (error) {
        console.error('Tailwind CSS 처리 중 오류 발생:', error)
        throw error
      }
    })

    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)
        createWindow()
    })

    if (!is.dev) {
      autoUpdater.checkForUpdates()

      let progressBar

      autoUpdater.on('update-available', () => {
        dialog
          .showMessageBox({
            type: 'info',
            title: 'Update available',
            message:
              'A new version of eggp-tools is available. Do you want to update now?',
            buttons: ['Later', 'Update'],
          })
          .then((result) => {
            const buttonIndex = result.response

            if (buttonIndex === 1)
              autoUpdater.downloadUpdate()
          })
      })

      autoUpdater.once('download-progress', (_progressObj) => {
        progressBar = new ProgressBar({
          text: 'Downloading...',
          detail: 'Downloading...',
        })

        progressBar
          .on('completed', () => {
            console.info(`completed...`)
            progressBar.detail = 'Task completed. Exiting...'
          })
          .on('aborted', () => {
            console.info(`aborted...`)
          })
      })

      autoUpdater.on('update-downloaded', () => {
        progressBar.setCompleted()
        dialog
          .showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install & restart now?',
            buttons: ['Restart', 'Later'],
          })
          .then((result) => {
            const buttonIndex = result.response

            if (buttonIndex === 0)
              autoUpdater.quitAndInstall(false, true)
          })
      })
    }
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
