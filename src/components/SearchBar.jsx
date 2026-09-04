import { MagnifyingGlass } from '@phosphor-icons/react'
import './SearchBar.css'

function SearchBar() {
  return (
    <div className="search-bar">
      <MagnifyingGlass size={24} color="var(--color-text-secondary)" />
      <input
        type="text"
        className="search-bar__input"
        placeholder="Pesquisar por um colaborador..."
      />
    </div>
  )
}

export default SearchBar
