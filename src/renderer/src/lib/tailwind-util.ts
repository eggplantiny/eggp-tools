import CheatSheet from '@/constants/tailwind-cheetsheet'

const arbitrarySupportedClasses = {
  'pt': 'padding-top',
  'pb': 'padding-bottom',
  'pl': 'padding-left',
  'pr': 'padding-right',
  'p': 'padding',
  'mb': 'margin-bottom',
  'm': 'margin',
  'mt': 'margin-top',
  'ml': 'margin-left',
  'mr': 'margin-right',
  'w': 'width',
  'h': 'height',
  'top': 'top',
  'bottom': 'bottom',
  'left': 'left',
  'right': 'right',
  'bg': 'background',
  'border': 'border-color',
  'text': 'color',
  'aspect': 'aspect-ratio',
  'color': 'color',
  'max-w': 'max-width',
  'max-h': 'max-height',
}

function convertToCss(classNames: string[], whitespace = '  ') {
  let cssCode = ``
  CheatSheet.forEach((element) => {
    element.content.forEach((content) => {
      content.table.forEach((list) => {
        if (classNames.includes(list[0])) {
          cssCode += `${whitespace}${list[1]} \n`
        }

        if (classNames.includes(list[1])) {
          const semicolon = list[2][list[2].length - 1] !== ';' ? ';' : ''
          cssCode += `${whitespace}${list[2]}${semicolon} \n`
        }
      })
    })
  })

  // Check for arbitrary values

  const arbitraryClasses = classNames.filter(className =>
    className.includes('['),
  )

  arbitraryClasses.forEach((className) => {
    try {
      const property = className.split('-[')[0].replace('.', '')

      // @ts-ignore
      const properyValue = className.match(/(?<=\[)[^\][]*(?=\])/g)[0]
      if (arbitrarySupportedClasses[property]) {
        cssCode += `${arbitrarySupportedClasses[property]}: ${properyValue};\n`
      }
    }
    catch (e) {
      console.log(e)
    }
  })

  return cssCode
}

function getBreakPoints(input: string, breakpoint: string) {
  return input
    .replaceAll('\n', ' ')
    .split(' ')
    .filter((i: string) => i.startsWith(`${breakpoint}:`))
    .map((i: string) => i.substring(3))
}

function getHoverClass(input: string) {
  return input
    .replaceAll('\n', ' ')
    .split(' ')
    .filter(i => i.startsWith('hover:'))
    .map(i => i.replace('hover:', ''))
}

function getAfterClass(input: string) {
  return input
    .replaceAll('\n', ' ')
    .split(' ')
    .filter(i => i.startsWith('after:'))
    .map(i => i.replace('after:', ''))
}

function getBeforeClass(input: string) {
  return input
    .replaceAll('\n', ' ')
    .split(' ')
    .filter(i => i.startsWith('before:'))
    .map(i => i.replace('before:', ''))
}

export function getConvertedClasses(name: string, input: string): string {
  if (input === '')
    return ''

  const classNames = input.split(/\s+/).map(i => i.trim()).filter(i => i !== '')
  const breakpoints = CheatSheet[0].content[1].table

  const hoverClasses = getHoverClass(input)
  const afterClasses = getAfterClass(input)
  const beforeClasses = getBeforeClass(input)

  const smClasses = getBreakPoints(input, 'sm')
  const mdClasses = getBreakPoints(input, 'md')
  const lgClasses = getBreakPoints(input, 'lg')
  const xlClasses = getBreakPoints(input, 'xl')
  const _2xlClasses = getBreakPoints(input, '2xl')

  const gen = (classNames: string[], whitespace = 2) => `.${name} {\n${convertToCss(classNames, ' '.repeat(whitespace))}}`

  const resultCss = `${gen(classNames)}

${smClasses.length !== 0
    ? breakpoints[0][1].replace('...', `\n${gen(smClasses, 4)}\n`)
    : ''
}

${mdClasses.length !== 0
    ? breakpoints[1][1].replace('...', `\n${convertToCss(mdClasses)}`)
    : ''
}

${lgClasses.length !== 0
    ? breakpoints[2][1].replace('...', `\n${convertToCss(lgClasses)}`)
    : ''
}

${xlClasses.length !== 0
    ? breakpoints[3][1].replace('...', `\n${convertToCss(xlClasses)}`)
    : ''
}

${_2xlClasses.length !== 0
    ? breakpoints[4][1].replace('...', `\n${convertToCss(_2xlClasses)}`)
    : ''
}

${hoverClasses.length !== 0 ? `:hover {\n${convertToCss(hoverClasses)}}` : ''}

${afterClasses.length !== 0 ? `.${name}::after {\n${convertToCss(afterClasses)}}` : ''}

${beforeClasses.length !== 0 ? `.${name}::before {\n${convertToCss(beforeClasses)}}` : ''}
`

  return resultCss.trimEnd()
}

const test = `flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`

console.log(getConvertedClasses('test', test))
