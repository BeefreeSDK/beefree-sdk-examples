import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReactEmailBuilderHeader } from './ReactEmailBuilderHeader'

describe('ReactEmailBuilderHeader', () => {
  it('renders Beefree SDK logo', () => {
    render(<ReactEmailBuilderHeader />)
    const logo = screen.getByRole('img', { name: /beefree sdk/i })
    expect(logo).toBeInTheDocument()
  })

  it('renders React brand (logo and text)', () => {
    render(<ReactEmailBuilderHeader />)
    expect(screen.getByRole('img', { name: /react/i })).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})