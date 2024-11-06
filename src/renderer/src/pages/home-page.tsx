import { PageRoot } from '@/components/ui/layout'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/color-tool')
  }, [])
  return (
    <PageRoot>
      <h1>Home Page</h1>
    </PageRoot>
  )
}
