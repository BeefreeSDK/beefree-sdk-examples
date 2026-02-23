import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('does not render Builder or Language UI dropdowns', () => {
    render(<App />)
    expect(screen.queryByLabelText(/builder:/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^language:/i)).not.toBeInTheDocument()
  })

  it('renders main content area', () => {
    render(<App />)
    const main = document.querySelector('main.main')
    expect(main).toBeInTheDocument()
    const content = document.querySelector('.content')
    expect(content).toBeInTheDocument()
  })
})
