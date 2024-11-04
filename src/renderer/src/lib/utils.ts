import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 타입 정의
type StyleObject = Record<string, string>

function formatStringToCamelCase(str: string): string {
  const splitted = str.split('-')
  if (splitted.length === 1)
    return splitted[0]
  return (
    splitted[0]
    + splitted
      .slice(1)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join('')
  )
}

export function getStyleObjectFromString(str: string): StyleObject {
  const style: StyleObject = {}
  str.split(';').forEach((el) => {
    const [property, value] = el.split(':')
    if (!property)
      return

    const formattedProperty = formatStringToCamelCase(property.trim())
    style[formattedProperty] = value.trim()
  })

  return style
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function extractClassNamesFromHtml(html: string): string[] {
  const classMap = new Map<string, number>()

  const classAttrRegex = /class\s*=\s*["']([^"']+)["']/g
  let match = classAttrRegex.exec(html)

  while (match !== null) {
    const classAttr = match[1]

    const classNames = classAttr.trim().split(/\s+/)
    classNames.forEach((className) => {
      classMap.set(className, (classMap.get(className) || 0) + 1)
    })

    match = classAttrRegex.exec(html)
  }

  return Array.from(classMap.keys())
}

export function refineCss(code: string): string {
  const filteredRules: string[] = []
  const regex = /([^{]+)\{([^}]*)\}/g

  let match = regex.exec(code)

  while (match !== null) {
    const selectors = match[1].trim()
    const selectorList = selectors.split(',').map(s => s.trim())
    const hasClassSelector = selectorList.some(selector => selector.startsWith('.'))

    if (hasClassSelector) {
      filteredRules.push(`${selectors} {${match[2]}}`)
    }

    match = regex.exec(code)
  }

  return filteredRules.join('\n')
}
