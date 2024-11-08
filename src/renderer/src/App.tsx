import { DefaultLayout } from '@/layouts/default-layout'
import { ColorToolPage } from '@/pages/color-tool-page'
import { CommentRemoverPage } from '@/pages/comment-remover-page'
import { DominantColorsPage } from '@/pages/dominant-colors-page'
import { FontToSvgPage } from '@/pages/font-to-svg-page'
import { HtmlToMarkdownPage } from '@/pages/html-to-markdown-page'

import { SvgToPngPage } from '@/pages/svg-to-png-page'
import TailwindcssToCssPage from '@/pages/tailwindcss-to-css-page'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Navigate to="color-tool" />} />
        <Route path="color-tool" element={<ColorToolPage />} />
        <Route path="html-to-markdown" element={<HtmlToMarkdownPage />} />
        <Route path="tailwindcss-to-css" element={<TailwindcssToCssPage />} />
        <Route path="comment-remover" element={<CommentRemoverPage />} />
        <Route path="svg-to-png" element={<SvgToPngPage />} />
        <Route path="font-to-svg" element={<FontToSvgPage />} />
        <Route path="dominant-colors" element={<DominantColorsPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App
