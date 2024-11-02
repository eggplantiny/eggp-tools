import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'

import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

import TurndownService from 'turndown'

import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('html-to-markdown', (_event, html: string) => {
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(html)
    return markdown
  })

  ipcMain.handle('tailwind-to-css', async (_event, classNames) => {
    try {
      // 클래스 이름을 문자열로 변환
      const _classNames = Array.isArray(classNames) ? classNames.join(' ') : classNames

      // Tailwind CSS가 클래스를 인식할 수 있도록 HTML 템플릿 생성
      const sourceHTML = `<div class="${_classNames}"></div>`

      // Tailwind CSS 설정
      const tailwindConfig = {
        content: [{ raw: sourceHTML, extension: 'html' }],
        // 필요에 따라 추가 Tailwind 설정을 여기에 포함할 수 있습니다.
      }

      // PostCSS를 사용하여 CSS 생성
      const result = await postcss([
        tailwindcss(tailwindConfig),
      ]).process('@tailwind base;\n@tailwind utilities;', { from: undefined })

      return result.css
    }
    catch (error) {
      console.error('Tailwind CSS 처리 중 오류 발생:', error)
      throw error // 오류를 다시 던져서 호출 측에서 처리할 수 있게 합니다.
    }
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
