export function fetchWithBackend(url: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.invoke('fetch-url', url)
      .then((result: ArrayBuffer) => resolve(result))
      .catch((error: string) => reject(error))
  })
}

export function tailwindToCss(classNames: string | string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.invoke('tailwind-to-css', classNames)
      .then((result: string) => resolve(result))
      .catch((error: string) => reject(error))
  })
}

export function htmlToMarkdown(html: string): Promise<string> {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.invoke('html-to-markdown', html)
      .then((result: string) => resolve(result))
      .catch((error: string) => reject(error))
  })
}
