import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
// @ts-ignore
import * as ProgressBar from 'electron-progressbar'
import { autoUpdater } from 'electron-updater'
import postcss from 'postcss'

import tailwindcss from 'tailwindcss'

import TurndownService from 'turndown'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

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

      /* 업데이트가 가능한지 확인하는 부분이다.
      업데이트가 가능한 경우 팝업이 뜨면서 업데이트를 하겠냐고 묻는다.
      Update를 클릭하면 업데이트 가능한 파일을 다운로드 받는다. */
      autoUpdater.on('update-available', () => {
        dialog
          .showMessageBox({
            type: 'info',
            title: 'Update available',
            message:
              'A new version of Project is available. Do you want to update now?',
            buttons: ['Update', 'Later'],
          })
          .then((result) => {
            const buttonIndex = result.response

            if (buttonIndex === 0)
              autoUpdater.downloadUpdate()
          })
      })

      /* progress bar가 없으면 업데이트를 다운받는 동안 사용자가 그 내용을 알 수 없기 때문에
      progress bar는 꼭 만들어준다. */
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

      // 업데이트를 다운받고 나면 업데이트 설치 후 재시작을 요청하는 팝업이 뜬다.
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
