import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { delay } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

interface ColorSwatchProps {
  color: string
}

interface ColorPaletteProps {
  colors: string[]
}

function ColorSwatch({ color }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`Copied ${color} 🚀`)
      await delay(1500)
      setCopied(false)
    }
    catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Label>
            {color}

            <Button
              onClick={() => copyToClipboard(color)}
              className={`relative mt-2 w-full h-12 p-0 rounded-md transition-transform transform hover:scale-105 active:scale-95 ${
                copied ? 'border-2 border-accent' : 'border border-accent-foreground'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Copy ${color}`}
            />
          </Label>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {copied ? 'Copied!' : color}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {colors.map((color, index) => (
        <ColorSwatch key={index} color={color} />
      ))}
    </div>
  )
}
