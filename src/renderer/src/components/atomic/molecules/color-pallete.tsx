import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { useState } from 'react'
import { toast } from 'sonner'

// ColorSwatch 컴포넌트
interface ColorSwatchProps {
  color: string
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`Copied ${color} 🚀`)
      setTimeout(() => setCopied(false), 1500) // 1.5초 후에 '복사됨' 표시 숨김
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

// ColorPalette 컴포넌트
interface ColorPaletteProps {
  colors: string[]
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {colors.map((color, index) => (
        <ColorSwatch key={index} color={color} />
      ))}
    </div>
  )
}
