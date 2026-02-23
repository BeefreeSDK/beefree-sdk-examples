import { MultiLanguageExample } from './MultiLanguageExample'
import { ReactEmailBuilderHeader } from './ReactEmailBuilderHeader'

export function App() {
  return (
    <main className="main">
      <ReactEmailBuilderHeader />
      <div className="content">
        <MultiLanguageExample />
      </div>
    </main>
  )
}
