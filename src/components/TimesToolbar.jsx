import searchIcon from '../assets/icons/Search.svg'
import './TimesToolbar.css'

function TimesToolbar({ total, searchQuery, onSearchChange }) {
  return (
    <div className="times-toolbar">
      <span className="times-toolbar__total">Total: {total} times</span>

      <div className="times-toolbar__search">
        <img src={searchIcon} width={20} height={20} alt="" />
        <input
          type="text"
          className="times-toolbar__search-input"
          placeholder="Pesquisar por um time..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </div>
  )
}

export default TimesToolbar
