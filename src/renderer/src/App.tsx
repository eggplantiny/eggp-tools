import DefaultLayout from '@/layouts/default-layout'
import { ColorToolPage } from '@/pages/color-tool-page'
import CommentRemoverPage from '@/pages/comment-remover-page'
import { HomePage } from '@/pages/home-page'
import { HtmlToMarkdownPage } from '@/pages/html-to-markdown-page'
import TailwindcssToCssPage from '@/pages/tailwindcss-to-css-page'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="color-tool" element={<ColorToolPage />} />
        <Route path="html-to-markdown" element={<HtmlToMarkdownPage />} />
        <Route path="tailwindcss-to-css" element={<TailwindcssToCssPage />} />
        <Route path="comment-remover" element={<CommentRemoverPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App
