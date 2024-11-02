// global.d.ts
import type { ElectronAPI } from '@electron-toolkit/preload'

export {}

class EyeDropper {
  constructor() {}
  open(): Promise<{ sRGBHex: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    EyeDropper: typeof EyeDropper
  }
}
