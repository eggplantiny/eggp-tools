import { useEffect } from 'react'

interface DefinePageMetaProps {
  title?: string
  description?: string
}

export default function usePageMeta(props: DefinePageMetaProps) {
  useEffect(() => {
    document.title = props.title ? `${props.title}` : ''
    document.querySelector('meta[name="description"]')?.setAttribute('content', props.description || '')
  }, [
    props.title,
    props.description,
  ])
}
