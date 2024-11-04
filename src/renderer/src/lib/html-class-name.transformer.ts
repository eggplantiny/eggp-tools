import * as cheerio from 'cheerio'

type ClassNameMap = Map<string, string[]>

export class HtmlClassNameTransformer {
  private html: string
  private $: any
  private tagCounters: Map<string, number>
  private classNameMapping: ClassNameMap
  private classNameCache: Map<string, string>

  constructor(html: string) {
    this.html = html
    this.$ = cheerio.load(this.html, null, false)
    this.tagCounters = new Map()
    this.classNameMapping = new Map()
    this.classNameCache = new Map()
  }

  public transform(): void {
    this.$('*').each((_, elem) => {
      this.processElement(elem)
    })
  }

  private processElement(element: any): void {
    const originalClassAttr = this.$(element).attr('class')
    if (!originalClassAttr) {
      return
    }

    const originalClassNamesArray = originalClassAttr.trim().split(/\s+/)
    const originalClassNamesSorted = originalClassNamesArray.slice().sort()
    const originalClassNamesString = originalClassNamesSorted.join(' ')

    const tagName = element.tagName
    const classKey = `${tagName}:${originalClassNamesString}`

    let newClassName: string
    if (this.classNameCache.has(classKey)) {
      // Use the cached new class name for this tag and class combination
      newClassName = this.classNameCache.get(classKey)!
    }
    else {
      // Generate a new class name and cache it
      const count = this.getNextTagCounter(tagName)
      newClassName = `${tagName}-${count}`
      this.classNameCache.set(classKey, newClassName)
      this.classNameMapping.set(newClassName, originalClassNamesArray)
    }

    // Replace the element's class attribute with the new class name
    this.$(element).attr('class', newClassName)
  }

  private getNextTagCounter(tagName: string): number {
    const currentCount = this.tagCounters.get(tagName) || 0
    const newCount = currentCount + 1
    this.tagCounters.set(tagName, newCount)
    return newCount
  }

  public getTransformedHtml(): string {
    return this.$.html()
  }

  public getClassNameMapping(): ClassNameMap {
    return this.classNameMapping
  }
}
