interface InputStrategy<InputType> {
  fetchData: (input: InputType) => Promise<ArrayBuffer>
}

class FileInputStrategy implements InputStrategy<File> {
  async fetchData(file: File): Promise<ArrayBuffer> {
    return await file.arrayBuffer()
  }
}

class UrlInputStrategy implements InputStrategy<string> {
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
