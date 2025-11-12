interface HeaderProps {
  onToggleComments: () => void
}

export const Header = ({ onToggleComments }: HeaderProps) => {
  return (
    <div className="demo-header">
      <h1>🎨 Commenting</h1>
      <p>Clicks on the comments button to show comments dialog</p>
      <button onClick={onToggleComments}>Toggle Comments</button>
    </div>
  )
}
