export interface InputStrategy<Input> {
  fetchData: (input: Input) => Promise<ArrayBuffer>
}

export class FileInputStrategy implements InputStrategy<File> {
  async fetchData(file: File): Promise<ArrayBuffer> {
    return await file.arrayBuffer()
  }
}

export class UrlInputStrategy implements InputStrategy<string> {
  async fetchData(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url)
    if (response.ok) {
      return await response.arrayBuffer()
    }
    else {
      throw new Error(`Failed to fetch data from URL: ${url}`)
    }
  }
}

export enum InputType {
  FILE = 'file',
  URL = 'url',
}

export class InputStrategyFactory {
  static createStrategy(type: InputType.FILE): FileInputStrategy
  static createStrategy(type: InputType.URL): UrlInputStrategy
  static createStrategy(type: InputType): InputStrategy<any> {
    switch (type) {
      case InputType.FILE:
        return new FileInputStrategy()
      case InputType.URL:
        return new UrlInputStrategy()
      default:
        throw new Error('Invalid input type')
    }
  }
}

export interface OutputStrategy<Output> {
  formatData: (data: ArrayBuffer) => Promise<Output>
}

export class TextOutputStrategy implements OutputStrategy<string> {
  async formatData(data: ArrayBuffer): Promise<string> {
    return new TextDecoder().decode(data)
  }
}

export class ArrayBufferOutputStrategy implements OutputStrategy<ArrayBuffer> {
  async formatData(data: ArrayBuffer): Promise<ArrayBuffer> {
    return data
  }
}

export enum OutputType {
  TEXT = 'text',
  ARRAY_BUFFER = 'arraybuffer',
}

export class OutputStrategyFactory {
  static createStrategy(type: OutputType.TEXT): TextOutputStrategy
  static createStrategy(type: OutputType.ARRAY_BUFFER): ArrayBufferOutputStrategy
  static createStrategy(type: OutputType): OutputStrategy<any> {
    switch (type) {
      case OutputType.TEXT:
        return new TextOutputStrategy()
      case OutputType.ARRAY_BUFFER:
        return new ArrayBufferOutputStrategy()
      default:
        throw new Error('Invalid output type')
    }
  }
}
