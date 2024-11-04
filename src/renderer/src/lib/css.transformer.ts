import * as css from 'css'

import { css as cssBeautify } from 'js-beautify'

interface Plugin {
  name: string
  process: (rule: css.Rule, context: ProcessingContext) => void
}

interface ProcessingContext {
  className: string
  declarations: css.Declaration[]
  atRules: { [atRule: string]: css.Rule[] }
}

const classSelectorPlugin: Plugin = {
  name: 'ClassSelectorPlugin',
  process: (rule, context) => {
    if (rule.type === 'rule' && rule.selectors) {
      const isClassSelector = rule.selectors.some(selector => selector.startsWith('.'))
      if (isClassSelector && rule.declarations) {
        context.declarations.push(...(rule.declarations as css.Declaration[]))
      }
    }
  },
}

const mediaAtRulePlugin: Plugin = {
  name: 'MediaAtRulePlugin',
  process: (rule, context) => {
    if (rule.type === 'media') {
      const atRuleName = `@media ${rule.media}`
      if (!context.atRules[atRuleName]) {
        context.atRules[atRuleName] = []
      }
      context.atRules[atRuleName].push(...(rule.rules as css.Rule[]))
    }
  },
}

export class CssTransformer {
  private plugins: Plugin[]

  constructor(plugins: Plugin[] = [classSelectorPlugin, mediaAtRulePlugin]) {
    this.plugins = plugins
  }

  public transform(className: string, code: string): string {
    const ast = css.parse(code)

    const context: ProcessingContext = {
      className,
      declarations: [],
      atRules: {},
    }

    const processRules = (rules: css.Rule[], _parentAtRule: css.AtRule | null = null) => {
      for (const rule of rules) {
        for (const plugin of this.plugins) {
          plugin.process(rule, context)
        }

        if ((rule as css.AtRule).rules) {
          processRules((rule as css.AtRule).rules as css.Rule[], rule as css.AtRule)
        }
      }
    }

    processRules(ast.stylesheet.rules as css.Rule[])

    let output = ''

    if (context.declarations.length > 0) {
      output += `.${className} {\n`
      output += this.declarationsToString(context.declarations)
      output += `\n}\n`
    }

    for (const atRuleName in context.atRules) {
      const rules = context.atRules[atRuleName]
      output += `${atRuleName} {\n`
      for (const rule of rules) {
        if ((rule as css.Rule).selectors) {
          (rule as css.Rule).selectors = [`.${className}`]
          output += `${css.stringify({ stylesheet: { rules: [rule] } }).trim()}\n`
        }
      }
      output += `}\n`
    }

    return cssBeautify(output.trim(), {
      indent_size: 2,
      indent_char: ' ',
    })
  }

  private declarationsToString(declarations: css.Declaration[]): string {
    return declarations
      .map(decl => `    ${decl.property}: ${decl.value};`)
      .join('\n')
  }
}
